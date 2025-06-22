const express = require('express');
const router = express.Router();
const dashboardKelasController = require('../controllers/dashboardKelasController');

// Route untuk menampilkan dashboard kelas
router.get('/', dashboardKelasController.getDashboardKelas);

// Route untuk masuk kelas dengan kode akses
router.post('/masuk', dashboardKelasController.masukKelas);

// Route untuk masuk kelas yang sudah terdaftar
router.post('/masuk-terdaftar/:praktikumId', dashboardKelasController.masukKelasTerdaftar);

module.exports = router; 