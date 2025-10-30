const { getDb } = require('../db');

class Product {
  static all() {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static findByCode(code) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE code = ?', [code], (err, row) => {
        db.close();
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static findById(id) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static create({ name, price, code, supplierEmail, releaseDate }) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, code, supplierEmail, releaseDate) VALUES (?,?,?,?,?)',
        [name, price, code, supplierEmail, releaseDate],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve({ id: this.lastID, name, price, code, supplierEmail, releaseDate });
        }
      );
    });
  }

  static update(id, { name, price, code, supplierEmail, releaseDate }) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET name=?, price=?, code=?, supplierEmail=?, releaseDate=? WHERE id=?',
        [name, price, code, supplierEmail, releaseDate, id],
        function (err) {
          db.close();
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  static delete(id) {
    const db = getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id=?', [id], function (err) {
        db.close();
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = Product;
