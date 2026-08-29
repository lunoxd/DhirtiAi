const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.use(authMiddleware);

// GET /api/dhriti/current - Latest score, risk level, delta, and safety status
router.get("/current", async (req, res) => {
  try {
    const userId = req.user.id;

    const latest = await prisma.checkIn.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    if (!latest) {
      return res.json({
        hasCheckIns: false,
        dhritiIndex: null,
        riskLevel: null,
        trend: null,
        deltaPoints: 0,
        safetyConcern: false,
        lastCheckInAt: null,
        supportRecommendation: "Complete your first check-in to see your Dhriti Index."
      });
    }

    return res.json({
      hasCheckIns: true,
      id: latest.id,
      dhritiIndex: latest.dhritiIndex,
      riskLevel: latest.riskLevel,
      trend: latest.trend,
      deltaPoints: latest.deltaPoints,
      safetyConcern: latest.safetyConcern,
      lastCheckInAt: latest.createdAt,
      supportRecommendation: latest.supportRecommendation,
      aiAnalysis: latest.aiAnalysis ? JSON.parse(latest.aiAnalysis) : null
    });
  } catch (error) {
    console.error("Get Current Dhriti Index Error:", error);
    return res.status(500).json({ error: "Failed to fetch current Dhriti Index." });
  }
});

// GET /api/dhriti/trend - Timeline data points for chart rendering
router.get("/trend", async (req, res) => {
  try {
    const userId = req.user.id;

    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // chronological for chart
      take: 20
    });

    const dataPoints = checkIns.map(c => ({
      id: c.id,
      date: c.createdAt.toISOString(),
      score: c.dhritiIndex,
      riskLevel: c.riskLevel,
      trend: c.trend,
      delta: c.deltaPoints,
      safetyConcern: c.safetyConcern
    }));

    return res.json({
      count: dataPoints.length,
      trendPoints: dataPoints
    });
  } catch (error) {
    console.error("Get Dhriti Trend Error:", error);
    return res.status(500).json({ error: "Failed to fetch trend data." });
  }
});

module.exports = router;
