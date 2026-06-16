const db = require("./db");

// USERS
function getUser(id) {
  return db.get2("SELECT * FROM users WHERE id = ?", [id]);
}
function getUserByEmail(email) {
  return db.get2("SELECT * FROM users WHERE email = ?", [email]);
}
function getUserByUsername(username) {
  return db.get2("SELECT * FROM users WHERE username = ?", [username]);
}
function saveUser(username, email, hash) {
  return db.run2("INSERT INTO users (username, email, mdp) VALUES (?, ?, ?)", [username, email, hash]);
}

// CATEGORIES
function getAllCategories() {
  return db.all2("SELECT * FROM categories ORDER BY name ASC");
}

// POSTS
function createPost(title, body, userId, categoryId, image) {
  return db.run2(
    "INSERT INTO posts (title, body, user_id, category_id, image) VALUES (?, ?, ?, ?, ?)",
    [title, body, userId, categoryId, image || null]
  );
}

function getAllPosts(filter, userId) {
  let where = "";
  if (filter === "mine" && userId) where = `WHERE posts.user_id = ${parseInt(userId)}`;
  else if (filter === "liked" && userId) where = `WHERE posts.id IN (SELECT post_id FROM liked_post WHERE user_id = ${parseInt(userId)})`;
  else if (filter && !isNaN(filter)) where = `WHERE posts.category_id = ${parseInt(filter)}`;

  return db.all2(`
    SELECT posts.*, users.username, categories.name AS category,
      (SELECT COUNT(*) FROM liked_post WHERE post_id = posts.id AND type='like') AS likes,
      (SELECT COUNT(*) FROM liked_post WHERE post_id = posts.id AND type='dislike') AS dislikes,
      (SELECT COUNT(*) FROM commentaires WHERE post_id = posts.id) AS comment_count
    FROM posts
    JOIN users ON users.id = posts.user_id
    JOIN categories ON categories.id = posts.category_id
    ${where}
    ORDER BY posts.created_at DESC
  `);
}

function getPostById(id) {
  return db.get2(`
    SELECT posts.*, users.username, categories.name AS category,
      (SELECT COUNT(*) FROM liked_post WHERE post_id = posts.id AND type='like') AS likes,
      (SELECT COUNT(*) FROM liked_post WHERE post_id = posts.id AND type='dislike') AS dislikes
    FROM posts
    JOIN users ON users.id = posts.user_id
    JOIN categories ON categories.id = posts.category_id
    WHERE posts.id = ?
  `, [id]);
}

function updatePost(id, title, body, categoryId) {
  return db.run2("UPDATE posts SET title=?, body=?, category_id=? WHERE id=?", [title, body, categoryId, id]);
}

function deletePost(id) {
  return db.run2("DELETE FROM posts WHERE id=?", [id]);
}

// COMMENTS
function createComment(body, postId, userId) {
  return db.run2("INSERT INTO commentaires (body, post_id, user_id) VALUES (?, ?, ?)", [body, postId, userId]);
}

function getCommentsByPost(postId) {
  return db.all2(`
    SELECT commentaires.*, users.username,
      (SELECT COUNT(*) FROM liked_commentaire WHERE commentaire_id = commentaires.id AND type='like') AS likes,
      (SELECT COUNT(*) FROM liked_commentaire WHERE commentaire_id = commentaires.id AND type='dislike') AS dislikes
    FROM commentaires
    JOIN users ON users.id = commentaires.user_id
    WHERE post_id = ?
    ORDER BY created_at ASC
  `, [postId]);
}

function getCommentById(id) {
  return db.get2("SELECT * FROM commentaires WHERE id=?", [id]);
}

function updateComment(id, body) {
  return db.run2("UPDATE commentaires SET body=? WHERE id=?", [body, id]);
}

function deleteComment(id) {
  return db.run2("DELETE FROM commentaires WHERE id=?", [id]);
}

// LIKES POSTS
async function toggleLikePost(postId, userId, type) {
  const existing = await db.get2("SELECT * FROM liked_post WHERE post_id=? AND user_id=?", [postId, userId]);
  if (existing) {
    if (existing.type === type) await db.run2("DELETE FROM liked_post WHERE post_id=? AND user_id=?", [postId, userId]);
    else await db.run2("UPDATE liked_post SET type=? WHERE post_id=? AND user_id=?", [type, postId, userId]);
  } else {
    await db.run2("INSERT INTO liked_post (post_id, user_id, type) VALUES (?, ?, ?)", [postId, userId, type]);
  }
}

function getUserLikePost(postId, userId) {
  return db.get2("SELECT type FROM liked_post WHERE post_id=? AND user_id=?", [postId, userId]);
}

// LIKES COMMENTS
async function toggleLikeComment(commentId, userId, type) {
  const existing = await db.get2("SELECT * FROM liked_commentaire WHERE commentaire_id=? AND user_id=?", [commentId, userId]);
  if (existing) {
    if (existing.type === type) await db.run2("DELETE FROM liked_commentaire WHERE commentaire_id=? AND user_id=?", [commentId, userId]);
    else await db.run2("UPDATE liked_commentaire SET type=? WHERE commentaire_id=? AND user_id=?", [type, commentId, userId]);
  } else {
    await db.run2("INSERT INTO liked_commentaire (commentaire_id, user_id, type) VALUES (?, ?, ?)", [commentId, userId, type]);
  }
}

function getUserLikeComment(commentId, userId) {
  return db.get2("SELECT type FROM liked_commentaire WHERE commentaire_id=? AND user_id=?", [commentId, userId]);
}

function getCommentLikeCounts(commentId) {
  return db.get2(`
    SELECT
      (SELECT COUNT(*) FROM liked_commentaire WHERE commentaire_id=? AND type='like') AS likes,
      (SELECT COUNT(*) FROM liked_commentaire WHERE commentaire_id=? AND type='dislike') AS dislikes
  `, [commentId, commentId]);
}

// SEARCH
function searchPosts(q) {
  return db.all2(`
    SELECT posts.*, users.username, categories.name AS category,
      (SELECT COUNT(*) FROM commentaires WHERE post_id = posts.id) AS comment_count
    FROM posts
    JOIN users ON users.id = posts.user_id
    JOIN categories ON categories.id = posts.category_id
    WHERE posts.title LIKE ? OR posts.body LIKE ?
    ORDER BY posts.created_at DESC
  `, [`%${q}%`, `%${q}%`]);
}

function searchUsers(q) {
  return db.all2("SELECT id, username, created_at FROM users WHERE username LIKE ?", [`%${q}%`]);
}

module.exports = {
  getUser, getUserByEmail, getUserByUsername, saveUser,
  getAllCategories,
  createPost, getAllPosts, getPostById, updatePost, deletePost,
  createComment, getCommentsByPost, getCommentById, updateComment, deleteComment,
  toggleLikePost, getUserLikePost,
  toggleLikeComment, getUserLikeComment, getCommentLikeCounts,
  searchPosts, searchUsers
};
