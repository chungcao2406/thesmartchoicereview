function requireAdmin(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/admin/login');
}

function attachUser(db) {
  return (req, res, next) => {
    res.locals.currentAdmin = null;
    if (req.session && req.session.userId) {
      const user = db.prepare('SELECT id, username, must_change_password FROM users WHERE id = ?').get(req.session.userId);
      res.locals.currentAdmin = user || null;
    }
    next();
  };
}

module.exports = { requireAdmin, attachUser };
