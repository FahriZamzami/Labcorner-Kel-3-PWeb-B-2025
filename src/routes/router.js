const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// === Auth Routes ===
const authenticationController = require('../controllers/authentication.controller');
router.post('/login', authenticationController.login);

module.exports = router;