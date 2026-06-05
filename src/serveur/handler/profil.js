const path = require("path");

function profilPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/profil.html"));
}

function profilSettingsPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/profil-settings.html"));
}

function profilEditPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/profil-edit.html"));
}

function profilEditPostHandler(req, res) {
  // TODO: Traiter la mise à jour du profil
  // - Récupérer les données du formulaire (firstname, lastname, username, email, bio, etc.)
  // - Valider les données
  // - Mettre à jour la base de données
  // - Rediriger vers /profil
  
  console.log("Données du profil reçues:", req.body);
  res.json({ success: true, message: "Profil mis à jour avec succès" });
}

module.exports = { 
  profilPageHandler,
  profilSettingsPageHandler,
  profilEditPageHandler,
  profilEditPostHandler
};