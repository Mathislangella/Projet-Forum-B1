const path = require("path");

function topicPageHandler(req, res) {
  res.sendFile(path.join(__dirname, "../../templates/topic.html"));
}

module.exports = { topicPageHandler };