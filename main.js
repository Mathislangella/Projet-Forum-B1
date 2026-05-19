const app = require("./src/serveur/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Erreur du serveur:", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("Erreur non attrapée:", err);
});
