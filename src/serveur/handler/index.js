const path = require("path");

function indexPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/index.html"));
}

module.exports = { indexPageHandler };