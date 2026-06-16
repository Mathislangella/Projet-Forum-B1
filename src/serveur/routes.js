const express = require("express");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../database/db-functions");
const { requireAuth } = require("./middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../public/uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ["image/jpeg", "image/png", "image/gif"].includes(file.mimetype));
  }
});

const tpl = (f) => path.join(__dirname, "../templates", f);

// ==================== PAGES ====================
router.get("/", (req, res) => res.sendFile(tpl("index.html")));
router.get("/home", (req, res) => res.sendFile(tpl("home.html")));
router.get("/connexion", (req, res) => res.sendFile(tpl("connexion.html")));
router.get("/inscription", (req, res) => res.sendFile(tpl("inscription.html")));
router.get("/search", (req, res) => res.sendFile(tpl("search.html")));
router.get("/topic/create", requireAuth, (req, res) => res.sendFile(tpl("topic-create.html")));
router.get("/topic/:id", (req, res) => res.sendFile(tpl("topic.html")));
router.get("/profil", requireAuth, (req, res) => res.sendFile(tpl("profil.html")));

// ==================== AUTH ====================
router.post("/api/inscription", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Champs manquants" });
    if (await db.getUserByEmail(email)) return res.status(400).json({ error: "Email déjà utilisé" });
    if (await db.getUserByUsername(username)) return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    const hash = await bcrypt.hash(password, 10);
    await db.saveUser(username, email, hash);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.post("/api/connexion", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.mdp))
      return res.status(401).json({ error: "Identifiants invalides" });
    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/home"));
});

// ==================== SESSION ====================
router.get("/api/me", (req, res) => res.json(req.session.user || null));

// ==================== CATEGORIES ====================
router.get("/api/categories", async (req, res) => {
  res.json(await db.getAllCategories());
});

// ==================== POSTS ====================
router.get("/api/posts", async (req, res) => {
  const { filter } = req.query;
  const userId = req.session.user?.id;
  res.json(await db.getAllPosts(filter, userId));
});

router.get("/api/posts/:id", async (req, res) => {
  const post = await db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post introuvable" });
  const userLike = req.session.user ? await db.getUserLikePost(post.id, req.session.user.id) : null;
  res.json({ ...post, userLike: userLike?.type || null });
});

router.post("/api/posts", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, body, categoryId } = req.body;
    if (!title || !body || !categoryId) return res.status(400).json({ error: "Champs manquants" });
    const image = req.file ? "/uploads/" + req.file.filename : null;
    await db.createPost(title, body, req.session.user.id, categoryId, image);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.put("/api/posts/:id", requireAuth, async (req, res) => {
  try {
    const post = await db.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Introuvable" });
    if (post.user_id !== req.session.user.id) return res.status(403).json({ error: "Interdit" });
    const { title, body, categoryId } = req.body;
    await db.updatePost(req.params.id, title, body, categoryId);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.delete("/api/posts/:id", requireAuth, async (req, res) => {
  try {
    const post = await db.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Introuvable" });
    if (post.user_id !== req.session.user.id) return res.status(403).json({ error: "Interdit" });
    await db.deletePost(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.post("/api/posts/:id/like", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    if (!["like", "dislike"].includes(type)) return res.status(400).json({ error: "Type invalide" });
    await db.toggleLikePost(req.params.id, req.session.user.id, type);
    const post = await db.getPostById(req.params.id);
    const userLike = await db.getUserLikePost(req.params.id, req.session.user.id);
    res.json({ likes: post.likes, dislikes: post.dislikes, userLike: userLike?.type || null });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

// ==================== COMMENTS ====================
router.get("/api/posts/:id/comments", async (req, res) => {
  const comments = await db.getCommentsByPost(req.params.id);
  if (req.session.user) {
    for (const c of comments) {
      const l = await db.getUserLikeComment(c.id, req.session.user.id);
      c.userLike = l?.type || null;
    }
  }
  res.json(comments);
});

router.post("/api/posts/:id/comments", requireAuth, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: "Commentaire vide" });
    await db.createComment(body, req.params.id, req.session.user.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.put("/api/comments/:id", requireAuth, async (req, res) => {
  try {
    const c = await db.getCommentById(req.params.id);
    if (!c) return res.status(404).json({ error: "Introuvable" });
    if (c.user_id !== req.session.user.id) return res.status(403).json({ error: "Interdit" });
    await db.updateComment(req.params.id, req.body.body);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.delete("/api/comments/:id", requireAuth, async (req, res) => {
  try {
    const c = await db.getCommentById(req.params.id);
    if (!c) return res.status(404).json({ error: "Introuvable" });
    if (c.user_id !== req.session.user.id) return res.status(403).json({ error: "Interdit" });
    await db.deleteComment(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

router.post("/api/comments/:id/like", requireAuth, async (req, res) => {
  try {
    const { type } = req.body;
    if (!["like", "dislike"].includes(type)) return res.status(400).json({ error: "Type invalide" });
    await db.toggleLikeComment(req.params.id, req.session.user.id, type);
    const counts = await db.getCommentLikeCounts(req.params.id);
    const userLike = await db.getUserLikeComment(req.params.id, req.session.user.id);
    res.json({ likes: counts.likes, dislikes: counts.dislikes, userLike: userLike?.type || null });
  } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

// ==================== SEARCH ====================
router.get("/api/search", async (req, res) => {
  const { q, type } = req.query;
  if (!q) return res.json([]);
  res.json(type === "users" ? await db.searchUsers(q) : await db.searchPosts(q));
});

// ==================== PROFIL ====================
router.get("/api/profil", requireAuth, async (req, res) => {
  const user = await db.getUser(req.session.user.id);
  if (!user) return res.status(401).json({ error: "Non connecté" });
  const { mdp, ...safe } = user;
  const posts = await db.getAllPosts("mine", user.id);
  res.json({ user: safe, posts });
});

module.exports = router;
