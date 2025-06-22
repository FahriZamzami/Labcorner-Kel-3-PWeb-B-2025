// src/routes/jadwal.routes.js
const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwalController');

// Route untuk jadwal praktikum
router.get('/', jadwalController.getJadwal);

module.exports = router;