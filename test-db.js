const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'truth-engine.db');
try {
    const db = new Database(dbPath);
    console.log('Successfully connected to database');
    const users = db.prepare('SELECT count(*) as count FROM users').get();
    console.log('User count:', users.count);
    db.close();
} catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
}
