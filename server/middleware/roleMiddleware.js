/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} allowedRoles - e.g. "DOCTOR", "ADMIN"
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const userRole = req.user.role || "USER";
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access forbidden. Required role: [${allowedRoles.join(", ")}], current role: ${userRole}`
      });
    }

    next();
  };
}

module.exports = { requireRole };
