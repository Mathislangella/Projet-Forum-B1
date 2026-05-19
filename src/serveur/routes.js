const express = require("express");
const router = express.Router();
const path = require("path");
const { homeHandler } = require("./handler/home");
const { inscriptionPageHandler, inscriptionPostHandler } = require("./handler/inscription");
const { connexionPageHandler, connexionPostHandler } = require("./handler/connexion");

router.get("/", homeHandler);

router.get("/home", homeHandler);

router.get("/inscription", inscriptionPageHandler);
router.post("/api/register", inscriptionPostHandler);

router.get("/connexion", connexionPageHandler);
router.post("/api/login", connexionPostHandler);

module.exports = router;