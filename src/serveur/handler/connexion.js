const db = require("../../database/db-functions");

const connexionPageHandler = (req, res) => {
  res.sendFile("connexion.html", { root: "src/templates" });
};

const connexionPostHandler = (req, res) => {
  const { email, password } = req.body;

  const user = db.getUserByEmail(email);

  if (!user || user.mdp !== password) {
    return res.status(401).send("Identifiants invalides");
  }

  req.session.user = {
    id: user.id,
    username: user.username
  };

  res.redirect("/home");
};

module.exports = {
  connexionPageHandler,
  connexionPostHandler
};