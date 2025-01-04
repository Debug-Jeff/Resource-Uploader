// API route definitions

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');

router.post('/', resourceController.create);
router.get('/', resourceController.getAll);

module.exports = router;