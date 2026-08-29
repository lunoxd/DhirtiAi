const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const { sendVerificationOTP } = require("../services/emailService");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dhriti_fallback_secret_key_2026";

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// In-memory fallback OTP cache for emails prior to user registration
const memoryOtpStore = new Map();

// POST /api/auth/send-otp - Sends a 6-digit verification code to Gmail via Resend.com
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid Gmail/email address." });
    }

    const emailClean = email.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in memory for registration step
    memoryOtpStore.set(emailClean, {
      otpCode,
      expiresAt: otpExpiresAt,
      verified: false
    });

    // If user exists in DB, save OTP fields
    const existingUser = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerificationOtp: otpCode,
          otpExpiresAt
        }
      });
    }

    // Dispatch OTP via Resend.com
    const emailResult = await sendVerificationOTP(emailClean, otpCode);

    return res.json({
      message: `A 6-digit verification code was sent to ${emailClean} via Resend.`,
      email: emailClean,
      resendDispatched: true,
      otpCode: process.env.NODE_ENV === "development" ? otpCode : undefined
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ error: "Failed to send verification email." });
  }
});

// POST /api/auth/verify-otp - Verifies 6-digit Gmail OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP code are required." });
    }

    const emailClean = email.trim().toLowerCase();
    const otpClean = otp.trim();

    // Check memory store first
    const memData = memoryOtpStore.get(emailClean);
    let isMatch = false;

    if (memData && memData.otpCode === otpClean && memData.expiresAt > new Date()) {
      isMatch = true;
      memData.verified = true;
      memoryOtpStore.set(emailClean, memData);
    }

    // Check DB
    const existingUser = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existingUser && existingUser.emailVerificationOtp === otpClean && existingUser.otpExpiresAt > new Date()) {
      isMatch = true;
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          isEmailVerified: true,
          emailVerificationOtp: null,
          otpExpiresAt: null
        }
      });
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    return res.json({
      message: "Gmail address verified successfully!",
      verified: true,
      email: emailClean
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ error: "Server error during OTP verification." });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, organization, specialization, otp } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const emailClean = email.trim().toLowerCase();
    if (!emailClean.includes("@") || password.length < 6) {
      return res.status(400).json({ error: "Provide a valid email and a password of at least 6 characters." });
    }

    // Check if email OTP verification was completed
    const memData = memoryOtpStore.get(emailClean);
    const isVerified = (memData && memData.verified) || (otp && memData && memData.otpCode === otp.trim());

    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const validRole = ["USER", "DOCTOR", "ADMIN"].includes(role) ? role : "USER";

    const user = await prisma.user.create({
      data: {
        email: emailClean,
        name: name.trim(),
        passwordHash,
        role: validRole,
        organization: organization || null,
        specialization: specialization || null,
        isEmailVerified: Boolean(isVerified)
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        specialization: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      message: "Account created successfully.",
      user,
      token
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const emailClean = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user.id);

    return res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        specialization: user.specialization,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
});

// POST /api/auth/demo - 1-Click login / provision for 3 distinct roles: USER, DOCTOR, ADMIN
router.post("/demo", async (req, res) => {
  try {
    const { role } = req.body;
    const requestedRole = ["USER", "DOCTOR", "ADMIN"].includes(role) ? role : "USER";

    let demoEmail, demoName, demoOrg, demoSpec;
    if (requestedRole === "DOCTOR") {
      demoEmail = "doctor.triage@dhriti.org";
      demoName = "Dr. Ananya Sharma";
      demoOrg = "Tele-MANAS & NIMHANS Clinical Partner";
      demoSpec = "Trauma & Crisis Psychologist";
    } else if (requestedRole === "ADMIN") {
      demoEmail = "admin.lead@dhriti.org";
      demoName = "Ashok (Platform Admin)";
      demoOrg = "DHRITI Operations Control";
      demoSpec = "System Administrator";
    } else {
      demoEmail = "survivor.demo@dhriti.org";
      demoName = "Maya (Survivor Demo)";
      demoOrg = null;
      demoSpec = null;
    }

    let user = await prisma.user.findUnique({
      where: { email: demoEmail }
    });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("DhritiSafe2026!", salt);

      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: demoName,
          passwordHash,
          role: requestedRole,
          organization: demoOrg,
          specialization: demoSpec,
          isEmailVerified: true
        }
      });
    } else if (user.role !== requestedRole) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: requestedRole, organization: demoOrg, specialization: demoSpec, isEmailVerified: true }
      });
    }

    const token = generateToken(user.id);

    return res.json({
      message: `Signed in as ${requestedRole}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        specialization: user.specialization,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return res.status(500).json({ error: "Failed to authenticate demo account." });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
