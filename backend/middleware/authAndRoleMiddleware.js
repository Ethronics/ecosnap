const jwt = require("jsonwebtoken");

// Usage: authAndRoleMiddleware('admin'), authAndRoleMiddleware('driver', 'traveler'), etc.
module.exports = function (...allowedRoles) {
  return function (req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided. Authorization denied." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (!allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role." });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };
};
