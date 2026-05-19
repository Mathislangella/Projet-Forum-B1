const path = require("path");

function connexionPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/connexion.html"));
}

function connexionPostHandler(req, res) {
  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe obligatoires" });
  }

  // TODO: Vérifier si l'utilisateur existe dans la base de données
  // TODO: Vérifier le mot de passe
  // TODO: Créer une session/token JWT

  res.status(200).json({ message: "Connexion réussie !" });
}

module.exports = { connexionPageHandler, connexionPostHandler };
