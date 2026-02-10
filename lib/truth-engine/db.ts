// Truth Engine — SQLite database connection + migrations
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'truth-engine.db');

/**
 * Get or create the SQLite database connection.
 * Creates the data directory and runs migrations on first connection.
 */
export function getDb(): Database.Database {
    if (db) return db;

    // Ensure data directory exists
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    db = new Database(DB_PATH);

    // Enable WAL mode for better concurrent read performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Run migrations
    migrate(db);

    return db;
}

/**
 * Run database migrations (idempotent).
 */
function migrate(db: Database.Database): void {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS handles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      handle TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'deleted')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profile_drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      canonical_json TEXT NOT NULL,
      visibility_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profile_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      handle TEXT NOT NULL,
      version_id TEXT UNIQUE NOT NULL,
      public_json TEXT NOT NULL,
      jsonld_json TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      schema_version TEXT NOT NULL DEFAULT '1.0.0',
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (handle) REFERENCES handles(handle) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS search_index (
      handle TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      headline TEXT,
      skills TEXT,
      location TEXT,
      organizations TEXT,
      titles TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (handle) REFERENCES handles(handle) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_snapshots_handle ON profile_snapshots(handle, is_published);
    CREATE INDEX IF NOT EXISTS idx_snapshots_latest ON profile_snapshots(handle, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_search_skills ON search_index(skills);
    CREATE INDEX IF NOT EXISTS idx_search_name ON search_index(name);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  `);
}

/**
 * Close the database connection (for cleanup/testing).
 */
export function closeDb(): void {
    if (db) {
        db.close();
        db = null;
    }
}
