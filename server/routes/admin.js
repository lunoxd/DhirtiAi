const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

// Apply auth and require ADMIN role
router.use(authMiddleware);
router.use(requireRole("ADMIN"));

// GET /api/admin/overview - Platform-wide KPI metrics and health
router.get("/overview", async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalAdmins,
      totalCheckIns,
      criticalCheckIns,
      checkInsList
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.checkIn.count(),
      prisma.checkIn.count({
        where: {
          OR: [
            { riskLevel: "Critical" },
            { safetyConcern: true }
          ]
        }
      }),
      prisma.checkIn.findMany({
        select: {
          dhritiIndex: true,
          riskLevel: true,
          safetyConcern: true
        }
      })
    ]);

    // Calculate risk distribution
    const distribution = {
      Stable: 0,
      Mild: 0,
      Elevated: 0,
      High: 0,
      Critical: 0
    };

    let totalScoreSum = 0;
    checkInsList.forEach(c => {
      totalScoreSum += c.dhritiIndex || 0;
      if (distribution[c.riskLevel] !== undefined) {
        distribution[c.riskLevel] += 1;
      }
    });

    const averageIndex = checkInsList.length > 0
      ? Math.round((totalScoreSum / checkInsList.length) * 10) / 10
      : 0;

    return res.json({
      metrics: {
        totalUsers,
        totalDoctors,
        totalAdmins,
        totalAccounts: totalUsers + totalDoctors + totalAdmins,
        totalCheckIns,
        activeCritical: criticalCheckIns,
        averageDhritiIndex: averageIndex
      },
      distribution,
      system: {
        groqStatus: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 5) ? "ONLINE" : "FALLBACK_MODE",
        database: "SQLite (Prisma ORM)",
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error("Admin Overview Error:", error);
    return res.status(500).json({ error: "Failed to load admin overview." });
  }
});

// GET /api/admin/users - User management directory
router.get("/users", async (req, res) => {
  try {
    const { role, search } = req.query;

    const where = {};
    if (role && role !== "ALL") {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: { checkIns: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      organization: u.organization,
      specialization: u.specialization,
      status: u.status || "ACTIVE",
      checkInCount: u._count.checkIns,
      createdAt: u.createdAt
    }));

    return res.json({ users: formatted });
  } catch (error) {
    console.error("Admin Users Error:", error);
    return res.status(500).json({ error: "Failed to fetch user directory." });
  }
});

// PUT /api/admin/users/:id/role - Update user role & status
router.put("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, organization, specialization, status } = req.body;

    const validRole = ["USER", "DOCTOR", "ADMIN"].includes(role) ? role : undefined;
    const validStatus = ["ACTIVE", "SUSPENDED"].includes(status) ? status : undefined;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: validRole,
        organization: organization !== undefined ? organization : undefined,
        specialization: specialization !== undefined ? specialization : undefined,
        status: validStatus
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        specialization: true,
        status: true
      }
    });

    return res.json({
      message: "User updated successfully.",
      user: updated
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    return res.status(500).json({ error: "Failed to update user." });
  }
});

// DELETE /api/admin/users/:id - Delete user account
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own administrative account." });
    }

    await prisma.user.delete({
      where: { id }
    });

    return res.json({ message: "User account and associated records deleted." });
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
});

// GET /api/admin/checkins - Global Check-ins audit feed
router.get("/checkins", async (req, res) => {
  try {
    const { riskLevel, safetyOnly } = req.query;

    const where = {};
    if (riskLevel && riskLevel !== "ALL") {
      where.riskLevel = riskLevel;
    }
    if (safetyOnly === "true") {
      where.safetyConcern = true;
    }

    const checkIns = await prisma.checkIn.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 60
    });

    const formatted = checkIns.map(c => ({
      id: c.id,
      userName: c.user?.name || "Anonymous",
      userEmail: c.user?.email,
      createdAt: c.createdAt,
      dhritiIndex: c.dhritiIndex,
      riskLevel: c.riskLevel,
      trend: c.trend,
      deltaPoints: c.deltaPoints,
      safetyConcern: c.safetyConcern,
      triageStatus: c.triageStatus,
      reviewedBy: c.reviewedBy,
      supportRecommendation: c.supportRecommendation
    }));

    return res.json({ checkIns: formatted });
  } catch (error) {
    console.error("Admin Check-ins Error:", error);
    return res.status(500).json({ error: "Failed to fetch global check-ins." });
  }
});

module.exports = router;
