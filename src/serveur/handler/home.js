const path = require("path");

function homePageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/home.html"));
}

module.exports = { homePageHandler };