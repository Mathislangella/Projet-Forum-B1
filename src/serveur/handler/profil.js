const fs = require("fs");
const path = require("path");
const db = require("../../database/db-functions");

function profilPageHandler(req, res) {
  const userId = req.session.user?.id;

  const user = db.getUser(userId);

  if (!user) {
    return res.status(401).send("Non connecté");
  }

  let html = fs.readFileSync(
    path.join(__dirname, "../../templates/profil.html"),
    "utf-8"
  );

  const profileData = {
    isOwner: true,
    userId: user.id,
    username: user.username,
    email: user.email
  };

  html = html.replace(
    "{{PROFILE_JSON}}",
    JSON.stringify(profileData)
  );

  return res.send(html);
}

function profilPublicPageHandler(req, res) {
  try {
    const userId = Number(req.params.id);
    const slug = req.params.slug;

    const user = db.getUser(userId);

    if (!user) {
      return res.status(404).send("Profil introuvable");
    }

    const correctSlug = user.username.toLowerCase().replace(/ /g, "-");

    if (slug !== correctSlug) {
      return res.redirect(`/profil/${user.id}-${correctSlug}`);
    }

    const currentUserId = req.session.user?.id || null;

    const profileData = {
      isOwner: currentUserId === userId,
      userId: user.id,
      username: user.username
    };

    let html = fs.readFileSync(
      path.join(__dirname, "../../templates/profil.html"),
      "utf-8"
    );

    html = html.replace(
      "{{PROFILE_JSON}}",
      JSON.stringify(profileData)
    );

    return res.send(html);

  } catch (err) {
    return res.status(500).send("Erreur serveur");
  }
}

function profilEditPageHandler(req, res) {
  return res.sendFile(
    path.join(__dirname, "../../templates/profil-edit.html")
  );
}

function profilSettingsPageHandler(req, res) {
  return res.sendFile(
    path.join(__dirname, "../../templates/profil-setting.html")
  );
}

function profilEditPostHandler(req, res) {
  return res.json({ success: true });
}

module.exports = {
  profilPageHandler,
  profilPublicPageHandler,
  profilEditPageHandler,
  profilSettingsPageHandler,
  profilEditPostHandler
};