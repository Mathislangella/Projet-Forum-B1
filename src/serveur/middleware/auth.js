function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/connexion");
  }
  next();
}

module.exports = { requireAuth };
