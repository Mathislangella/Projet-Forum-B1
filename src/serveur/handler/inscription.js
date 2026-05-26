const path = require("path");
const bcryptjs = require("bcryptjs");
const { saveUser, getUserByEmail, getUserByUsername } = require("../../database/db-functions");

function inscriptionPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/inscription.html"));
}

async function inscriptionPostHandler(req, res) {
  try {
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

    // Vérifier si l'utilisateur existe déjà
    const existingEmail = getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const existingUsername = getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Ce username est déjà utilisé" });
    }

    // Hash le mot de passe
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Enregistrer l'utilisateur dans la base de données
    saveUser(username, email, hashedPassword);

    res.status(201).json({ message: "Inscription réussie ! Redirection vers la connexion..." });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
}

module.exports = { inscriptionPageHandler, inscriptionPostHandler };
