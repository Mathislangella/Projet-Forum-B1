# Forum Web — Node.js / Express / SQLite

## Prérequis
- Node.js v18+

## Installation

```bash
npm install
npm start
```

Le forum démarre sur **http://localhost:3000**

## Fonctionnalités

- Inscription / Connexion / Déconnexion (mots de passe hashés avec bcryptjs)
- Sessions avec expiration 24h
- Posts avec catégories et image optionnelle (JPEG, PNG, GIF, max 20Mo)
- Commentaires sur les posts
- Like / Dislike sur les posts et commentaires
- Modifier / Supprimer ses propres posts et commentaires
- Filtrage des posts : tous / mes posts / posts likés / par catégorie
- Recherche de posts et d'utilisateurs
- Page profil avec liste de ses posts
- Accès lecture pour les visiteurs non connectés
- Gestion des erreurs HTTP (404, 500)

## Structure

```
forum/
├── main.js                     # Point d'entrée
├── package.json
├── public/
│   ├── css/style.css
│   ├── js/
│   │   ├── connexion.js
│   │   └── inscription.js
│   ├── uploads/                # Images uploadées
│   └── images/icon/
├── src/
│   ├── database/
│   │   ├── db.js               # Init SQLite
│   │   └── db-functions.js     # Toutes les requêtes
│   ├── serveur/
│   │   ├── app.js              # Config Express
│   │   ├── routes.js           # Toutes les routes
│   │   └── middleware/auth.js
│   └── templates/              # Pages HTML
│       ├── index.html
│       ├── home.html
│       ├── connexion.html
│       ├── inscription.html
│       ├── topic.html
│       ├── topic-create.html
│       ├── search.html
│       ├── profil.html
│       └── error.html
```
