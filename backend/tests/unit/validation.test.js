const { createRules } = require('../../validators/productValidator');
const { validationResult } = require('express-validator');

function runValidation(rules, body) {
  const req = { body };
  const res = {};
  const next = () => {};
  return Promise.all(rules.map(r => r.run(req, res, next))).then(() => validationResult(req));
}

test('odrzuca błędny email i złą cenę', async () => {
  const result = await runValidation(createRules, {
    name: 'TV',
    price: -5,
    code: 'TV-01',
    supplierEmail: 'bad',
    releaseDate: '2026-01-01'
  });
  expect(result.isEmpty()).toBe(false);
});
