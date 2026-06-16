const db = require("./db");

// USERS
function getUser(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

function saveUser(username, email, password) {
  return db.prepare(`
    INSERT INTO users (username, email, mdp)
    VALUES (?, ?, ?)
  `).run(username, email, password);
}

// POSTS
function createPost(title, body, userId, categoryId) {
  return db.prepare(`
    INSERT INTO posts (title, body, user_id, category_id)
    VALUES (?, ?, ?, ?)
  `).run(title, body, userId, categoryId);
}

function getAllPosts() {
  return db.prepare(`
    SELECT posts.*, users.username, categories.name AS category
    FROM posts
    JOIN users ON users.id = posts.user_id
    JOIN categories ON categories.id = posts.category_id
    ORDER BY posts.created_at DESC
  `).all();
}

// TOPIC DETAIL
function getPostById(id) {
  return db.prepare(`
    SELECT posts.*, users.username, categories.name AS category
    FROM posts
    JOIN users ON users.id = posts.user_id
    JOIN categories ON categories.id = posts.category_id
    WHERE posts.id = ?
  `).get(id);
}

// COMMENTS
function createComment(body, postId, userId) {
  return db.prepare(`
    INSERT INTO commentaires (body, post_id, user_id)
    VALUES (?, ?, ?)
  `).run(body, postId, userId);
}

function getCommentsByPost(postId) {
  return db.prepare(`
    SELECT commentaires.*, users.username
    FROM commentaires
    JOIN users ON users.id = commentaires.user_id
    WHERE post_id = ?
    ORDER BY created_at ASC
  `).all(postId);
}

module.exports = {
  getUser,
  getUserByEmail,
  saveUser,
  createPost,
  getAllPosts,
  getPostById,
  createComment,
  getCommentsByPost
};