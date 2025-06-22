const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route untuk dashboard utama
router.get('/', dashboardController.getDashboard);

// Route untuk daftar modul lengkap
router.get('/modul', dashboardController.getDaftarModul);

// Route untuk daftar mahasiswa
router.get('/mahasiswa', dashboardController.getDaftarMahasiswa);

module.exports = router; 