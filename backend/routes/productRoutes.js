const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { createRules, idRule } = require('../validators/productValidator');

router.get('/', ctrl.getAll);
router.get('/:id', idRule, ctrl.getOne);
router.post('/', createRules, ctrl.create);
router.put('/:id', [...idRule, ...createRules], ctrl.update);
router.delete('/:id', idRule, ctrl.remove);

module.exports = router;
