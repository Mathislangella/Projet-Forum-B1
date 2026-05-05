function homeHandler(req, res) {
  res.sendFile(path.join(__dirname, "../views/index.html"));
}

module.exports = { homeHandler };