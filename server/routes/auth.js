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

// POST /api/auth/register
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
        specialization: specialization || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        specialization: true,
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
    const { role } = req.body; // "USER" | "DOCTOR" | "ADMIN"
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
          specialization: demoSpec
        }
      });
    } else if (user.role !== requestedRole) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: requestedRole, organization: demoOrg, specialization: demoSpec }
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
