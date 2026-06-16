const db = require("../../database/db-functions");

const homePageHandler = (req, res) => {
  const posts = db.getAllPosts();

  res.render("home", {
    posts,
    user: req.session.user || null
  });
};

module.exports = {
  homePageHandler
};