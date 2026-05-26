const db = require('./db.js');

// ============ USERS ============

const saveUser = (username, email, password) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, mdp)
      VALUES (?, ?, ?)
    `);
    return stmt.run(username, email, password);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('Username ou email déjà existant');
    }
    throw err;
  }
};

const getUser = (id) => {
  try {
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    return stmt.get(id);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération de l'utilisateur: ${err.message}`);
  }
};

const getUserByUsername = (username) => {
  try {
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    return stmt.get(username);
  } catch (err) {
    throw new Error(`Erreur lors de la recherche par username: ${err.message}`);
  }
};

const getUserByEmail = (email) => {
  try {
    const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
    return stmt.get(email);
  } catch (err) {
    throw new Error(`Erreur lors de la recherche par email: ${err.message}`);
  }
};

// ============ CATEGORIES ============

const createCategory = (name, description) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `);
    return stmt.run(name, description);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('Cette catégorie existe déjà');
    }
    throw err;
  }
};

const getCategory = (id) => {
  try {
    const stmt = db.prepare(`SELECT * FROM categories WHERE id = ?`);
    return stmt.get(id);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération de la catégorie: ${err.message}`);
  }
};

const getAllCategories = () => {
  try {
    const stmt = db.prepare(`SELECT * FROM categories`);
    return stmt.all();
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des catégories: ${err.message}`);
  }
};

// ============ POSTS ============

const createPost = (title, body, userId, categoryId) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO posts (title, body, user_id, categorie_id)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(title, body, userId, categoryId);
  } catch (err) {
    throw new Error(`Erreur lors de la création du post: ${err.message}`);
  }
};

const getPost = (id) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, u.username, c.name as categorie_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.categorie_id = c.id
      WHERE p.id = ?
    `);
    return stmt.get(id);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération du post: ${err.message}`);
  }
};

const getPostsByCategory = (categoryId, limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, u.username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.categorie_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(categoryId, limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des posts: ${err.message}`);
  }
};

const getAllPosts = (limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, u.username, c.name as categorie_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.categorie_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des posts: ${err.message}`);
  }
};

const getPostsByUser = (userId, limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM posts
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des posts de l'utilisateur: ${err.message}`);
  }
};

const updatePost = (id, title, body) => {
  try {
    const stmt = db.prepare(`
      UPDATE posts
      SET title = ?, body = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(title, body, id);
  } catch (err) {
    throw new Error(`Erreur lors de la mise à jour du post: ${err.message}`);
  }
};

const deletePost = (id) => {
  try {
    const stmt = db.prepare(`DELETE FROM posts WHERE id = ?`);
    return stmt.run(id);
  } catch (err) {
    throw new Error(`Erreur lors de la suppression du post: ${err.message}`);
  }
};

const searchPosts = (keyword, limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, u.username, c.name as categorie_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.categorie_id = c.id
      WHERE p.title LIKE ? OR p.body LIKE ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `);
    const searchTerm = `%${keyword}%`;
    return stmt.all(searchTerm, searchTerm, limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la recherche: ${err.message}`);
  }
};

// ============ COMMENTAIRES ============

const createCommentaire = (body, postId, userId, commentaireId = null) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO commentaires (body, post_id, commentaire_id, user_id)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(body, postId, commentaireId, userId);
  } catch (err) {
    throw new Error(`Erreur lors de la création du commentaire: ${err.message}`);
  }
};

const getCommentaire = (id) => {
  try {
    const stmt = db.prepare(`
      SELECT c.*, u.username
      FROM commentaires c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `);
    return stmt.get(id);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération du commentaire: ${err.message}`);
  }
};

const getCommentairesForPost = (postId, limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT c.*, u.username
      FROM commentaires c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? AND c.commentaire_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(postId, limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des commentaires: ${err.message}`);
  }
};

const getRepliesForCommentaire = (commentaireId, limit = 10, offset = 0) => {
  try {
    const stmt = db.prepare(`
      SELECT c.*, u.username
      FROM commentaires c
      JOIN users u ON c.user_id = u.id
      WHERE c.commentaire_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(commentaireId, limit, offset);
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des réponses: ${err.message}`);
  }
};

const updateCommentaire = (id, body) => {
  try {
    const stmt = db.prepare(`
      UPDATE commentaires
      SET body = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(body, id);
  } catch (err) {
    throw new Error(`Erreur lors de la mise à jour du commentaire: ${err.message}`);
  }
};

const deleteCommentaire = (id) => {
  try {
    const stmt = db.prepare(`DELETE FROM commentaires WHERE id = ?`);
    return stmt.run(id);
  } catch (err) {
    throw new Error(`Erreur lors de la suppression du commentaire: ${err.message}`);
  }
};

// ============ LIKES POST ============

const likePost = (postId, userId) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO liked_post (post_id, user_id)
      VALUES (?, ?)
    `);
    return stmt.run(postId, userId);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('Vous avez déjà liké ce post');
    }
    throw err;
  }
};

const unlikePost = (postId, userId) => {
  try {
    const stmt = db.prepare(`
      DELETE FROM liked_post
      WHERE post_id = ? AND user_id = ?
    `);
    return stmt.run(postId, userId);
  } catch (err) {
    throw new Error(`Erreur lors du unlikage du post: ${err.message}`);
  }
};

const hasUserLikedPost = (postId, userId) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM liked_post
      WHERE post_id = ? AND user_id = ?
    `);
    return stmt.get(postId, userId) !== undefined;
  } catch (err) {
    throw new Error(`Erreur lors de la vérification du like: ${err.message}`);
  }
};

const getLikesCountPost = (postId) => {
  try {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM liked_post
      WHERE post_id = ?
    `);
    return stmt.get(postId).count;
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des likes: ${err.message}`);
  }
};

// ============ LIKES COMMENTAIRES ============

const likeCommentaire = (commentaireId, userId) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO liked_commentaire (commentaire_id, user_id)
      VALUES (?, ?)
    `);
    return stmt.run(commentaireId, userId);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      throw new Error('Vous avez déjà liké ce commentaire');
    }
    throw err;
  }
};

const unlikeCommentaire = (commentaireId, userId) => {
  try {
    const stmt = db.prepare(`
      DELETE FROM liked_commentaire
      WHERE commentaire_id = ? AND user_id = ?
    `);
    return stmt.run(commentaireId, userId);
  } catch (err) {
    throw new Error(`Erreur lors du unlikage du commentaire: ${err.message}`);
  }
};

const hasUserLikedCommentaire = (commentaireId, userId) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM liked_commentaire
      WHERE commentaire_id = ? AND user_id = ?
    `);
    return stmt.get(commentaireId, userId) !== undefined;
  } catch (err) {
    throw new Error(`Erreur lors de la vérification du like: ${err.message}`);
  }
};

const getLikesCountCommentaire = (commentaireId) => {
  try {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM liked_commentaire
      WHERE commentaire_id = ?
    `);
    return stmt.get(commentaireId).count;
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des likes: ${err.message}`);
  }
};

// ============ STATS ============

const getPostCount = () => {
  try {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM posts`);
    return stmt.get().count;
  } catch (err) {
    throw new Error(`Erreur lors du comptage des posts: ${err.message}`);
  }
};

const getCommentCount = () => {
  try {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM commentaires`);
    return stmt.get().count;
  } catch (err) {
    throw new Error(`Erreur lors du comptage des commentaires: ${err.message}`);
  }
};

const getTotalLikes = () => {
  try {
    const postsLikes = db.prepare(`SELECT COUNT(*) as count FROM liked_post`).get().count;
    const commentairesLikes = db.prepare(`SELECT COUNT(*) as count FROM liked_commentaire`).get().count;
    return {
      posts: postsLikes,
      commentaires: commentairesLikes,
      total: postsLikes + commentairesLikes
    };
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des likes: ${err.message}`);
  }
};

const getUserCount = () => {
  try {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM users`);
    return stmt.get().count;
  } catch (err) {
    throw new Error(`Erreur lors du comptage des utilisateurs: ${err.message}`);
  }
};

const getCategoryStats = (categoryId) => {
  try {
    const postCount = db.prepare(`SELECT COUNT(*) as count FROM posts WHERE categorie_id = ?`).get(categoryId).count;
    const commentCount = db.prepare(`
      SELECT COUNT(*) as count FROM commentaires c
      JOIN posts p ON c.post_id = p.id
      WHERE p.categorie_id = ?
    `).get(categoryId).count;
    return {
      posts: postCount,
      commentaires: commentCount
    };
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des stats: ${err.message}`);
  }
};

// ============ EXPORTS ============

module.exports = {
  // Users
  saveUser,
  getUser,
  getUserByUsername,
  getUserByEmail,
  // Categories
  createCategory,
  getCategory,
  getAllCategories,
  // Posts
  createPost,
  getPost,
  getPostsByCategory,
  getAllPosts,
  getPostsByUser,
  updatePost,
  deletePost,
  searchPosts,
  // Commentaires
  createCommentaire,
  getCommentaire,
  getCommentairesForPost,
  getRepliesForCommentaire,
  updateCommentaire,
  deleteCommentaire,
  // Likes Posts
  likePost,
  unlikePost,
  hasUserLikedPost,
  getLikesCountPost,
  // Likes Commentaires
  likeCommentaire,
  unlikeCommentaire,
  hasUserLikedCommentaire,
  getLikesCountCommentaire,
  // Stats
  getPostCount,
  getCommentCount,
  getTotalLikes,
  getUserCount,
  getCategoryStats
};
