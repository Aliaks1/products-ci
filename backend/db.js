const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'data.sqlite');

function getDb() {
  return new sqlite3.Database(dbFile);
}

function migrate() {
  const db = getDb();
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        code TEXT NOT NULL UNIQUE,
        supplierEmail TEXT NOT NULL,
        releaseDate TEXT NOT NULL
      )
    `);
  });
  db.close();
  console.log('Migracja wykonana.');
}

function seed() {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO products (name, price, code, supplierEmail, releaseDate) VALUES (?,?,?,?,?)'
  );
  stmt.run('Kamera HD', 1299.99, 'CAM-2025', 'shop@example.com', '2025-01-10');
  stmt.finalize();
  db.close();
  console.log('Seed dodany.');
}

if (require.main === module) {
  const cmd = process.argv[2];
  if (cmd === 'migrate') migrate();
  if (cmd === 'seed') seed();
}

module.exports = { getDb };
