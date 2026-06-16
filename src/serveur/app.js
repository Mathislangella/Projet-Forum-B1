const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "forum-secret-key-2024",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24h
}));

app.use(express.static(path.join(__dirname, "../../public")));

app.use("/", require("./routes"));

// Erreurs 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../../src/templates/error.html"));
});

// Erreurs 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).sendFile(path.join(__dirname, "../../src/templates/error.html"));
});

module.exports = app;
