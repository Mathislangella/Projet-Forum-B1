const db = require("../../database/db-functions");

// ===== TOPIC PAGE =====
const topicPageHandler = (req, res) => {
  const id = req.params.id;

  const topic = db.getAllPosts().find(p => p.id == id);
  if (!topic) return res.status(404).send("Topic introuvable");

  const comments = db.getCommentsByPost(id);

  res.render("topic", {
    topic,
    comments,
    user: req.session.user || null
  });
};

// ===== CREATE TOPIC PAGE =====
const topicCreatePageHandler = (req, res) => {
  res.render("topic-create");
};

// ===== CREATE TOPIC POST =====
const topicCreatePostHandler = (req, res) => {
  const { title, body, categoryId } = req.body;

  if (!title || !body || !categoryId) {
    return res.status(400).send("Champs manquants");
  }

  db.createPost(
    title,
    body,
    req.session.user.id,
    categoryId
  );

  res.redirect("/home");
};

module.exports = {
  topicPageHandler,
  topicCreatePageHandler,
  topicCreatePostHandler
};