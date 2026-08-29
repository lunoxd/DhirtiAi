require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const checkinRoutes = require("./routes/checkins");
const dhritiRoutes = require("./routes/dhriti");
const supportRoutes = require("./routes/support");

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "DHRITI API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 5)
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/dhriti", dhritiRoutes);
app.use("/api/support", supportRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "An internal server error occurred.",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[DHRITI Server] Running on http://localhost:${PORT}`);
  console.log(`[DHRITI Server] Health check: http://localhost:${PORT}/api/health`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("[DHRITI Server] Gracefully shutting down.");
  });
});

module.exports = app;
