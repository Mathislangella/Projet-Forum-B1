const path = require("path");
const bcryptjs = require("bcryptjs");
const { getUserByEmail } = require("../../database/db-functions");

function connexionPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/connexion.html"));
}

async function connexionPostHandler(req, res) {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe obligatoires" });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcryptjs.compare(password, user.mdp);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // TODO: Créer une session/token JWT
    res.status(200).json({ 
      message: "Connexion réussie !", 
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
}

module.exports = { connexionPageHandler, connexionPostHandler };
