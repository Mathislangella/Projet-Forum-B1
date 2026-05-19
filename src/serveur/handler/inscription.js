const path = require("path");

function inscriptionPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/inscription.html"));
}

function inscriptionPostHandler(req, res) {
  const { username, email, password, "confirm-password": confirmPassword } = req.body;

  // Validation basique
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  // TODO: Vérifier si l'utilisateur existe déjà dans la base de données
  // TODO: Hash le mot de passe
  // TODO: Enregistrer l'utilisateur dans la base de données

  res.status(200).json({ message: "Inscription réussie !" });
}

module.exports = { inscriptionPageHandler, inscriptionPostHandler };
