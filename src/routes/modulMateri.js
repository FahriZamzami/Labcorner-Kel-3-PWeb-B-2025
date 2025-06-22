// src/routes/modulMateri.js
const express = require('express');
const router = express.Router();
const modulMateriController = require('../controllers/modulMateriController');

// Route untuk halaman Modul Materi
router.get('/', modulMateriController.getModulMateri);

// Route untuk download modul
router.get('/download/:modulId', modulMateriController.downloadModul);

// Route untuk mendapatkan statistik download
router.get('/stats', modulMateriController.getDownloadStats);

module.exports = router;