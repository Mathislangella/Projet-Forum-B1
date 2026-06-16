const express = require("express");
const router = express.Router();

const { indexPageHandler } = require("./handler/index");
const { inscriptionPageHandler, inscriptionPostHandler } = require("./handler/inscription");
const { connexionPageHandler, connexionPostHandler } = require("./handler/connexion");
const { homePageHandler } = require("./handler/home");
const { searchPageHandler } = require("./handler/search");

const {
  topicPageHandler,
  topicCreatePageHandler,
  topicCreatePostHandler
} = require("./handler/topic");

const {
  profilPageHandler,
  profilSettingsPageHandler,
  profilEditPageHandler,
  profilEditPostHandler,
  profilPublicPageHandler
} = require("./handler/profil");

const { requireAuth } = require("./middleware/auth");

// HOME
router.get("/", indexPageHandler);
router.get("/home", homePageHandler);

// AUTH
router.get("/inscription", inscriptionPageHandler);
router.post("/inscription", inscriptionPostHandler);

router.get("/connexion", connexionPageHandler);
router.post("/connexion", connexionPostHandler);

// SEARCH
router.get("/search", searchPageHandler);

// TOPIC
router.get("/topic/:id", topicPageHandler);
router.get("/topic/create", requireAuth, topicCreatePageHandler);
router.post("/topic/create", requireAuth, topicCreatePostHandler);

// PROFIL
router.get("/profil", requireAuth, profilPageHandler);
router.get("/profil/settings", requireAuth, profilSettingsPageHandler);
router.get("/profil/edit", requireAuth, profilEditPageHandler);
router.post("/profil/edit", requireAuth, profilEditPostHandler);

router.get("/profil/:id-:slug", profilPublicPageHandler);

router.get("/profil/:id", (req, res) => {
  const db = require("../database/db-functions");

  const user = db.getUser(req.params.id);
  if (!user) return res.status(404).send("User introuvable");

  const slug = user.username.toLowerCase().replace(/ /g, "-");
  res.redirect(`/profil/${user.id}-${slug}`);
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

module.exports = router;