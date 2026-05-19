const path = require("path");

function homeHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/index.html"));
}

module.exports = { homeHandler };