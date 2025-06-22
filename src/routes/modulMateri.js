// src/routes/modulMateri.js
const express = require('express');
const router = express.Router();

// Route untuk halaman Modul Materi
router.get('/', (req, res) => {
  res.render('modulMateri', { currentPage: 'modulMateri' });  // Mengarahkan ke halaman Modul Materi
});

module.exports = router;