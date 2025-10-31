const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { errorResponse } = require('../middlewares/errorFormatter');

const toFieldErrors = (result) =>
  result.array().map((e) => ({
    field: e.path,
    code: e.msg.includes('email') ? 'INVALID_FORMAT' : 'INVALID_VALUE',
    message: e.msg
  }));

// 🔹 GET /api/products
exports.getAll = async (_, res) => {
  const rows = await Product.all();
  res.json(rows);
};

// 🔹 GET /api/products/:id
exports.getOne = async (req, res) => {
  const { id } = req.params;
  const row = await Product.findById(id);
  if (!row) return errorResponse(res, 404, 'Not Found');
  res.json(row);
};

// 🔹 POST /api/products
exports.create = async (req, res) => {
  const { code } = req.body;

  // 1️⃣ Проверяем дубликат кода (409)
  const dup = await Product.findByCode(code);
  if (dup) {
    return errorResponse(res, 409, 'Conflict', [
      { field: 'code', code: 'DUPLICATE', message: 'Kod już istnieje' }
    ]);
  }

  // 2️⃣ Проверяем валидацию (400)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Bad Request', toFieldErrors(errors));
  }

  // 3️⃣ Создаём продукт (201)
  const created = await Product.create(req.body);
  res.status(201).json(created);
};

// 🔹 PUT /api/products/:id
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Bad Request', toFieldErrors(errors));

  const ok = await Product.update(req.params.id, req.body);
  if (!ok) return errorResponse(res, 404, 'Not Found');
  res.json({ updated: true });
};

// 🔹 DELETE /api/products/:id
exports.remove = async (req, res) => {
  const ok = await Product.delete(req.params.id);
  if (!ok) return errorResponse(res, 404, 'Not Found');
  res.status(204).send();
};
