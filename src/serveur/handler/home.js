const path = require("path");

function homePageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/home.html"));
}

function homePosetHandler(req, res) {
  res.status(200).json({ message: "Bienvenue sur la page d'accueil du forum !" });
}

module.exports = { homePageHandler, homePosetHandler };