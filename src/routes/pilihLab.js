// src/routes/pilihLab.js
const express = require('express');
const router = express.Router();
const pilihLabController = require('../controllers/pilihLabController');

// Route untuk menampilkan halaman Pilih Lab
router.get('/', pilihLabController.getDaftarLab);

// Route untuk menampilkan halaman input kode akses
router.get('/enterCode/:labId', pilihLabController.getEnterCode);

// Route untuk memproses kode akses lab
router.post('/joinLab', pilihLabController.joinLab);

module.exports = router;