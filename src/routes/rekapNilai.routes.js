const express = require('express');
const router = express.Router();
const rekapNilaiController = require('../controllers/rekapNilaiController');

// Route untuk menampilkan halaman rekap nilai
router.get('/', rekapNilaiController.getRekapNilai);

// Route untuk generate PDF
router.get('/generate-pdf', rekapNilaiController.generatePDF);

module.exports = router; 