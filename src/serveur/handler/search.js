const path = require("path");

function searchPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/search.html"));
}

module.exports = { searchPageHandler };