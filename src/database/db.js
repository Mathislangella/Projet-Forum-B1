const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'forum.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username VARCHAR NOT NULL UNIQUE,
        email VARCHAR NOT NULL UNIQUE,
        mdp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        description VARCHAR NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        body VARCHAR NOT NULL,
        user_id INTEGER NOT NULL,
        categorie_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (categorie_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS commentaires (
        id INTEGER PRIMARY KEY,
        body VARCHAR NOT NULL,
        post_id INTEGER,
        commentaire_id INTEGER,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (commentaire_id) REFERENCES commentaires(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS liked_post (
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS liked_commentaire (
        commentaire_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (commentaire_id, user_id),
        FOREIGN KEY (commentaire_id) REFERENCES commentaires(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);

console.log('✅ Base de données initialisée');

module.exports = db;