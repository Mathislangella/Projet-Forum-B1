const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../../public")));
console.log(__dirname);

// Routes
const routes = require("./routes");
app.use("/", routes);

module.exports = app;