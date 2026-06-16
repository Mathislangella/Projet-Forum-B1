const db = require("./db");

// ===== CREATE COMMENT =====
function createComment(body, postId, userId, parentId = null) {
  const stmt = db.prepare(`
    INSERT INTO commentaires (body, post_id, user_id, parent_id)
    VALUES (?, ?, ?, ?)
  `);

  return stmt.run(body, postId, userId, parentId);
}

// ===== GET COMMENTS BY POST =====
function getCommentsByPost(postId) {
  return db.prepare(`
    SELECT 
      commentaires.*,
      users.username,
      users.avatar
    FROM commentaires
    JOIN users ON users.id = commentaires.user_id
    WHERE post_id = ?
    ORDER BY created_at ASC
  `).all(postId);
}

module.exports = {
  createComment,
  getCommentsByPost
};