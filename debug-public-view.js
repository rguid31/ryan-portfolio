const Database = require('better-sqlite3');
const db = new Database('data/truth-engine.db');

try {
    const handle = 'alice';

    // Check if handle REALLY exists in handles table
    const handleRow = db.prepare('SELECT * FROM handles WHERE handle = ?').get(handle);
    console.log(`HANDLE row for ${handle}:`, handleRow);

    // Check snapshots (table name: profile_snapshots)
    const snapshot = db.prepare('SELECT * FROM profile_snapshots WHERE handle = ? ORDER BY version_id DESC LIMIT 1').get(handle);

    if (snapshot) {
        console.log(`SNAPSHOT_FOUND: Version ${snapshot.version_id}`);
        console.log(`Content Hash: ${snapshot.content_hash}`);
    } else {
        console.log('NO_SNAPSHOTS_FOUND');
        console.log('Action: The user needs to click "Publish" in the dashboard.');
    }

} catch (e) {
    console.log('ERROR:', e.message);
}
