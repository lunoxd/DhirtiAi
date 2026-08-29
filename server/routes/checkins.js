const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const { calculateDhritiIndex } = require("../services/scoringEngine");
const { analyzeWithGroq } = require("../services/groqService");

const router = express.Router();

// Apply auth to all check-in routes
router.use(authMiddleware);

// POST /api/checkins - Submit and evaluate a new mental wellbeing check-in
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { structuredResponses, writtenResponses } = req.body;

    if (!structuredResponses || typeof structuredResponses !== "object") {
      return res.status(400).json({ error: "Structured responses are required for check-in." });
    }

    // 1. Fetch user's previous check-ins for trend evaluation
    const previousCheckIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // 2. Perform Groq AI qualitative analysis (with guaranteed fallback)
    const aiAnalysis = await analyzeWithGroq(structuredResponses, writtenResponses || {});

    // 3. Calculate Deterministic 0-100 Dhriti Index & Risk Level
    const scoringResult = calculateDhritiIndex(structuredResponses, previousCheckIns, aiAnalysis);

    // 4. Save check-in record to database
    const savedCheckIn = await prisma.checkIn.create({
      data: {
        userId,
        structuredResponses: JSON.stringify(structuredResponses),
        writtenResponses: writtenResponses ? JSON.stringify(writtenResponses) : null,
        aiAnalysis: JSON.stringify(aiAnalysis),
        dhritiIndex: scoringResult.dhritiIndex,
        riskLevel: scoringResult.riskLevel,
        trend: scoringResult.trend,
        deltaPoints: scoringResult.deltaPoints,
        safetyConcern: scoringResult.safetyConcern,
        supportRecommendation: scoringResult.supportRecommendation
      }
    });

    return res.status(201).json({
      message: "Check-in evaluated and saved successfully.",
      checkIn: {
        id: savedCheckIn.id,
        createdAt: savedCheckIn.createdAt,
        dhritiIndex: savedCheckIn.dhritiIndex,
        riskLevel: savedCheckIn.riskLevel,
        trend: savedCheckIn.trend,
        deltaPoints: savedCheckIn.deltaPoints,
        safetyConcern: savedCheckIn.safetyConcern,
        supportRecommendation: savedCheckIn.supportRecommendation,
        noticedItems: scoringResult.noticedItems,
        aiAnalysis,
        structuredResponses,
        writtenResponses
      }
    });
  } catch (error) {
    console.error("Check-in Processing Error:", error);
    return res.status(500).json({ error: "Failed to process check-in." });
  }
});

// GET /api/checkins/history - Get user check-in history
router.get("/history", async (req, res) => {
  try {
    const userId = req.user.id;
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const parsedCheckIns = checkIns.map(c => ({
      id: c.id,
      createdAt: c.createdAt,
      dhritiIndex: c.dhritiIndex,
      riskLevel: c.riskLevel,
      trend: c.trend,
      deltaPoints: c.deltaPoints,
      safetyConcern: c.safetyConcern,
      supportRecommendation: c.supportRecommendation,
      structuredResponses: c.structuredResponses ? JSON.parse(c.structuredResponses) : {},
      writtenResponses: c.writtenResponses ? JSON.parse(c.writtenResponses) : {},
      aiAnalysis: c.aiAnalysis ? JSON.parse(c.aiAnalysis) : null
    }));

    return res.json({ checkIns: parsedCheckIns });
  } catch (error) {
    console.error("Get History Error:", error);
    return res.status(500).json({ error: "Failed to fetch check-in history." });
  }
});

// GET /api/checkins/:id - Get specific check-in
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const checkIn = await prisma.checkIn.findFirst({
      where: { id, userId }
    });

    if (!checkIn) {
      return res.status(404).json({ error: "Check-in record not found." });
    }

    return res.json({
      checkIn: {
        id: checkIn.id,
        createdAt: checkIn.createdAt,
        dhritiIndex: checkIn.dhritiIndex,
        riskLevel: checkIn.riskLevel,
        trend: checkIn.trend,
        deltaPoints: checkIn.deltaPoints,
        safetyConcern: checkIn.safetyConcern,
        supportRecommendation: checkIn.supportRecommendation,
        structuredResponses: checkIn.structuredResponses ? JSON.parse(checkIn.structuredResponses) : {},
        writtenResponses: checkIn.writtenResponses ? JSON.parse(checkIn.writtenResponses) : {},
        aiAnalysis: checkIn.aiAnalysis ? JSON.parse(checkIn.aiAnalysis) : null
      }
    });
  } catch (error) {
    console.error("Get Single Check-in Error:", error);
    return res.status(500).json({ error: "Failed to fetch check-in record." });
  }
});

// DELETE /api/checkins/:id - Delete single check-in
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.checkIn.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: "Check-in not found or not authorized." });
    }

    await prisma.checkIn.delete({
      where: { id }
    });

    return res.json({ message: "Check-in record deleted." });
  } catch (error) {
    console.error("Delete Check-in Error:", error);
    return res.status(500).json({ error: "Failed to delete check-in record." });
  }
});

// DELETE /api/checkins - Privacy data wipe: delete all user check-ins
router.delete("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await prisma.checkIn.deleteMany({
      where: { userId }
    });

    return res.json({
      message: "All check-in data has been permanently deleted.",
      deletedCount: result.count
    });
  } catch (error) {
    console.error("Bulk Delete Check-ins Error:", error);
    return res.status(500).json({ error: "Failed to delete check-in data." });
  }
});

module.exports = router;
