function adminOnly(req, res, next) {
  const role = (req.user?.role || '').toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

function managerOrAdmin(req, res, next) {
  const role = (req.user?.role || '').toLowerCase();
  if (role !== 'admin' && role !== 'manager') {
    return res.status(403).json({ message: 'Manager or Admin access required' });
  }
  next();
}

module.exports = { adminOnly, managerOrAdmin };
