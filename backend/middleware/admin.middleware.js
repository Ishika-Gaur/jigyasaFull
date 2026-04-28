const adminOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  if (req.admin.role !== "admin" && req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

const superAdminOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Super admins only." });
  }

  next();
};

module.exports = { adminOnly, superAdminOnly };