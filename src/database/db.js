const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'forum.db'));

db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,

        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        mdp TEXT NOT NULL,

        firstname TEXT,
        lastname TEXT,
        bio TEXT,
        avatar TEXT DEFAULT '/images/avatar.png',

        city TEXT,
        country TEXT,
        interests TEXT,

        language TEXT DEFAULT 'fr',
        theme TEXT DEFAULT 'dark',
        show_online INTEGER DEFAULT 1,
        public_profile INTEGER DEFAULT 1,
        contact_permission TEXT DEFAULT 'all',
        profile_visibility TEXT DEFAULT 'all',

        notify_replies INTEGER DEFAULT 1,
        notify_mentions INTEGER DEFAULT 1,
        notify_messages INTEGER DEFAULT 1,
        newsletter INTEGER DEFAULT 0,

        two_factor_enabled INTEGER DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS commentaires (
        id INTEGER PRIMARY KEY,
        body TEXT NOT NULL,
        post_id INTEGER NOT NULL,
        parent_id INTEGER,
        user_id INTEGER NOT NULL,
        edited INTEGER DEFAULT 0,
        deleted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES commentaires(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS liked_post (
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS liked_commentaire (
        commentaire_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (commentaire_id, user_id),
        FOREIGN KEY (commentaire_id) REFERENCES commentaires(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

console.log('✅ Base de données initialisée');

module.exports = db;