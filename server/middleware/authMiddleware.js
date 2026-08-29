const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "dhriti_fallback_secret_key_2026";

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    if (!user) {
      return res.status(401).json({ error: "User associated with token no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid authentication token." });
  }
}

module.exports = authMiddleware;
