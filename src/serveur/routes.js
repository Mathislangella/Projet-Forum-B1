const express = require("express");

const router = express.Router();
const path = require("path");

// Import handlers
const { indexPageHandler } = require("./handler/index");
const { inscriptionPageHandler, inscriptionPostHandler } = require("./handler/inscription");
const { connexionPageHandler, connexionPostHandler } = require("./handler/connexion");
const { homePageHandler } = require("./handler/home");
const { searchPageHandler } = require("./handler/search");
const { topicPageHandler } = require("./handler/topic");
const { profilPageHandler, profilSettingsPageHandler, profilEditPageHandler, profilEditPostHandler } = require("./handler/profil");

// ========================
//      Index Routes
// ========================
router.get("/", indexPageHandler);

// ========================
//       Auth Routes
// ========================
router.get("/inscription", inscriptionPageHandler);
router.post("/inscription", inscriptionPostHandler);

router.get("/connexion", connexionPageHandler);
router.post("/connexion", connexionPostHandler);

// ========================
//       Home Routes
// ========================
router.get("/home", homePageHandler);
router.get("/search", searchPageHandler);

// ========================
//    Navigation Routes
// ========================
router.get("/topic", topicPageHandler);

// ========================
// Profil Routes
// ========================
router.get("/profil", profilPageHandler);

router.get("/profil/settings", profilSettingsPageHandler);

router.get("/profil/edit", profilEditPageHandler);
router.post("/profil/edit", profilEditPostHandler);

module.exports = router;