const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

// Apply auth and require DOCTOR or ADMIN role
router.use(authMiddleware);
router.use(requireRole("DOCTOR", "ADMIN"));

// GET /api/doctor/triage - Get flagged survivor distress check-ins
router.get("/triage", async (req, res) => {
  try {
    const { status, filter } = req.query;

    const whereClause = {};

    if (status && status !== "ALL") {
      whereClause.triageStatus = status;
    }

    if (filter === "CRITICAL") {
      whereClause.OR = [
        { riskLevel: "Critical" },
        { safetyConcern: true }
      ];
    } else if (filter === "HIGH") {
      whereClause.riskLevel = { in: ["High", "Critical"] };
    }

    const checkIns = await prisma.checkIn.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { safetyConcern: "desc" },
        { dhritiIndex: "desc" },
        { createdAt: "desc" }
      ],
      take: 50
    });

    const formatted = checkIns.map(c => ({
      id: c.id,
      userId: c.userId,
      userAlias: c.user?.name || "Anonymous Survivor",
      userEmail: c.user?.email,
      createdAt: c.createdAt,
      dhritiIndex: c.dhritiIndex,
      riskLevel: c.riskLevel,
      trend: c.trend,
      deltaPoints: c.deltaPoints,
      safetyConcern: c.safetyConcern,
      supportRecommendation: c.supportRecommendation,
      triageStatus: c.triageStatus || "PENDING",
      triageNotes: c.triageNotes,
      reviewedBy: c.reviewedBy,
      reviewedAt: c.reviewedAt,
      structuredResponses: c.structuredResponses ? JSON.parse(c.structuredResponses) : {},
      writtenResponses: c.writtenResponses ? JSON.parse(c.writtenResponses) : {},
      aiAnalysis: c.aiAnalysis ? JSON.parse(c.aiAnalysis) : null
    }));

    return res.json({
      count: formatted.length,
      queue: formatted
    });
  } catch (error) {
    console.error("Doctor Triage Error:", error);
    return res.status(500).json({ error: "Failed to load triage queue." });
  }
});

// POST /api/doctor/triage/:id/status - Update triage status & clinical notes
router.post("/triage/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { triageStatus, triageNotes } = req.body;

    const validStatus = ["PENDING", "IN_PROGRESS", "CONTACTED", "RESOLVED"].includes(triageStatus)
      ? triageStatus
      : "IN_PROGRESS";

    const updated = await prisma.checkIn.update({
      where: { id },
      data: {
        triageStatus: validStatus,
        triageNotes: triageNotes !== undefined ? triageNotes : undefined,
        reviewedBy: req.user.name,
        reviewedAt: new Date()
      }
    });

    return res.json({
      message: "Triage status updated successfully.",
      checkInId: updated.id,
      triageStatus: updated.triageStatus,
      triageNotes: updated.triageNotes,
      reviewedBy: updated.reviewedBy,
      reviewedAt: updated.reviewedAt
    });
  } catch (error) {
    console.error("Update Triage Status Error:", error);
    return res.status(500).json({ error: "Failed to update triage status." });
  }
});

// GET /api/doctor/stats - Quick triage stats for doctors/counselors
router.get("/stats", async (req, res) => {
  try {
    const [totalQueue, criticalCount, pendingCount, resolvedCount] = await Promise.all([
      prisma.checkIn.count({
        where: {
          OR: [
            { riskLevel: { in: ["High", "Critical"] } },
            { safetyConcern: true }
          ]
        }
      }),
      prisma.checkIn.count({
        where: {
          OR: [
            { riskLevel: "Critical" },
            { safetyConcern: true }
          ],
          triageStatus: { not: "RESOLVED" }
        }
      }),
      prisma.checkIn.count({
        where: { triageStatus: "PENDING" }
      }),
      prisma.checkIn.count({
        where: { triageStatus: "RESOLVED" }
      })
    ]);

    return res.json({
      totalFlagged: totalQueue,
      activeCritical: criticalCount,
      pendingReview: pendingCount,
      resolved: resolvedCount
    });
  } catch (error) {
    console.error("Doctor Stats Error:", error);
    return res.status(500).json({ error: "Failed to load doctor statistics." });
  }
});

module.exports = router;
