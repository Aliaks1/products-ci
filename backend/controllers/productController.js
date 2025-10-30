const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { errorResponse } = require('../middlewares/errorFormatter');

const toFieldErrors = (result) =>
  result.array().map((e) => ({
    field: e.path,
    code: e.msg.includes('email') ? 'INVALID_FORMAT' : 'INVALID_VALUE',
    message: e.msg
  }));

exports.getAll = async (_, res) => {
  const rows = await Product.all();
  res.json(rows);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const row = await Product.findById(id);
  if (!row) return errorResponse(res, 404, 'Not Found');
  res.json(row);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Bad Request', toFieldErrors(errors));

  const { code } = req.body;
  const dup = await Product.findByCode(code);
  if (dup) return errorResponse(res, 409, 'Conflict', [{ field: 'code', code: 'DUPLICATE', message: 'Kod już istnieje' }]);

  const created = await Product.create(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 400, 'Bad Request', toFieldErrors(errors));

  const ok = await Product.update(req.params.id, req.body);
  if (!ok) return errorResponse(res, 404, 'Not Found');
  res.json({ updated: true });
};

exports.remove = async (req, res) => {
  const ok = await Product.delete(req.params.id);
  if (!ok) return errorResponse(res, 404, 'Not Found');
  res.status(204).send();
};
