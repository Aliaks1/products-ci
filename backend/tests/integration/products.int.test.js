const request = require('supertest');
const app = require('../../app');
const { getDb } = require('../../db');

beforeAll((done) => {
  const db = getDb();
  db.serialize(() => {
    db.run('DELETE FROM products');
    db.run(`INSERT INTO products (name, price, code, supplierEmail, releaseDate)
            VALUES ('Test', 10.5, 'CODE-1', 'a@b.com', '2024-05-01')`);
  });
  db.close();
  done();
});

it('POST z błędnym payloadem → 400', async () => {
  const res = await request(app).post('/api/products').send({
    name: 'X', price: 0, code: 'AA', supplierEmail: 'x', releaseDate: '2999-01-01'
  });
  expect(res.status).toBe(400);
});

it('POST z duplikatem → 409', async () => {
  const res = await request(app).post('/api/products').send({
    name: 'Ok', price: 1, code: 'CODE-1', supplierEmail: 'ok@ex.com', releaseDate: '2024-01-01'
  });
  expect(res.status).toBe(409);
});

it('GET/DELETE nieistniejącego zasobu → 404', async () => {
  expect((await request(app).get('/api/products/99999')).status).toBe(404);
  expect((await request(app).delete('/api/products/99999')).status).toBe(404);
});
