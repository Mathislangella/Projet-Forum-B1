const app = require("./src/serveur/app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Forum sur http://localhost:${PORT}`));
