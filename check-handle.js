const Database = require('better-sqlite3');
const db = new Database('data/truth-engine.db');

try {
    const row = db.prepare('SELECT handle FROM handles LIMIT 1').get();
    if (row) {
        console.log(`FOUND_HANDLE: ${row.handle}`);
    } else {
        console.log('NO_HANDLE_FOUND');
    }
} catch (e) {
    console.log('ERROR:', e.message);
}
