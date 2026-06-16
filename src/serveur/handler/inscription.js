const db = require("../../database/db-functions");

const inscriptionPageHandler = (req, res) => {
  res.sendFile("inscription.html", { root: "src/templates" });
};

const inscriptionPostHandler = (req, res) => {
  const { username, email, password } = req.body;

  const existing = db.getUserByEmail(email);
  if (existing) return res.status(400).send("Email déjà utilisé");

  db.saveUser(username, email, password);

  res.redirect("/connexion");
};

module.exports = {
  inscriptionPageHandler,
  inscriptionPostHandler
};