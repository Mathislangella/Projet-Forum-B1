const express = require("express");
const router = express.Router();
const { homeHandler } = require("./handler/home");

router.get("/", homeHandler);

module.exports = router;