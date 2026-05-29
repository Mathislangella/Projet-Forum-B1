const express = require("express");

const router = express.Router();
const path = require("path");

const { indexPageHandler } = require("./handler/index");
const { inscriptionPageHandler, inscriptionPostHandler } = require("./handler/inscription");
const { connexionPageHandler, connexionPostHandler } = require("./handler/connexion");
const { homePageHandler } = require("./handler/home");
const { searchPageHandler } = require("./handler/search");
const { topicPageHandler } = require("./handler/topic");

router.get("/", indexPageHandler);
router.get("/inscription", inscriptionPageHandler);
router.post("/api/register", inscriptionPostHandler);
router.get("/connexion", connexionPageHandler);
router.post("/api/login", connexionPostHandler);
router.get("/home", homePageHandler);
//router.post("/api/home", homePostHandler);
router.get("/search", searchPageHandler);
//router.post("/api/search", searchPostHandler);
router.get("/topic", topicPageHandler);

module.exports = router;