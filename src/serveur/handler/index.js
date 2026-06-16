const indexPageHandler = (req, res) => {
  res.sendFile("index.html", { root: "src/templates" });
};

module.exports = {
  indexPageHandler
};