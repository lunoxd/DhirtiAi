const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dhriti_fallback_secret_key_2026";

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register - Supports USER or DOCTOR (Pending Admin Approval)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, organization, specialization } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const emailClean = email.trim().toLowerCase();
    if (!emailClean.includes("@") || password.length < 6) {
      return res.status(400).json({ error: "Provide a valid email and a password of at least 6 characters." });
    }

    // Admin role is strictly forbidden via public registration
    if (role === "ADMIN") {
      return res.status(403).json({ error: "Admin account creation is strictly prohibited via public registration." });
    }

    const existing = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Doctor accounts require Admin approval before activation
    const requestedRole = role === "DOCTOR" ? "DOCTOR" : "USER";
    const initialStatus = requestedRole === "DOCTOR" ? "PENDING_APPROVAL" : "ACTIVE";

    const user = await prisma.user.create({
      data: {
        email: emailClean,
        name: name.trim(),
        passwordHash,
        role: requestedRole,
        organization: organization || null,
        specialization: specialization || null,
        status: initialStatus,
        isEmailVerified: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        specialization: true,
        status: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    if (requestedRole === "DOCTOR") {
      return res.status(201).json({
        message: "Doctor registration submitted successfully! Your account is pending Admin review and approval.",
        pendingApproval: true,
        user
      });
    }

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

    // Enforce Doctor Pending Admin Approval check
    if (user.role === "DOCTOR" && user.status === "PENDING_APPROVAL") {
      return res.status(403).json({
        error: "Your Doctor registration is currently pending Admin review and approval. Please contact Admin chiru@gmail.com."
      });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        error: "Your account has been suspended by system administration."
      });
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
        status: user.status,
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

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
