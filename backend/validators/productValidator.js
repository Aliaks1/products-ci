const { body, param } = require('express-validator');

const todayIso = () => new Date().toISOString().slice(0, 10);

const createRules = [
  body('name').isString().trim().isLength({ min: 3, max: 50 }).withMessage('Nazwa 3-50 znaków'),
  body('price').isFloat({ gt: 0 }).withMessage('Cena > 0'),
  body('code').matches(/^[A-Za-z0-9-]{4,20}$/).withMessage('Kod 4-20 znaków, litery/cyfry/myślnik'),
  body('supplierEmail').isEmail().withMessage('Niepoprawny email'),
  body('releaseDate')
    .isISO8601().withMessage('Data ISO8601')
    .custom((v) => v <= todayIso()).withMessage('Data nie późniejsza niż dziś')
];

const idRule = [param('id').isInt({ gt: 0 })];

module.exports = { createRules, idRule };
