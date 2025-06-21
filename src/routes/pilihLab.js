// src/routes/pilihLab.js
const express = require('express');
const router = express.Router();

// Dummy data untuk lab
const daftarLab = [
  { id: 1, name: 'Laboratory of Enterprise Application', code: '12345' },
  { id: 2, name: 'Laboratory of Geographic Information System', code: '67890' },
  { id: 3, name: 'Laboratorium Dasar Komputasi', code: '11223' },
  { id: 4, name: 'Laboratorium Business Intelligence', code: '44556' }
];

// Route untuk menampilkan halaman Pilih Lab
router.get('/', (req, res) => {
  res.render('pilihLab');  // Menampilkan halaman Pilih Lab
});

// Route untuk memproses kode akses lab
router.post('/joinLab', (req, res) => {
  const { labCode, labId } = req.body;

  // Mencari lab berdasarkan kode akses
  const lab = daftarLab.find(lab => lab.code === labCode && lab.id == labId);
  if (lab) {
    // Jika kode valid, arahkan pengguna ke halaman utama (Modul Materi dan Sidebar)
    res.redirect('/home');  // Anda bisa mengganti ini dengan route yang sesuai
  } else {
    // Jika kode tidak valid, kirimkan pesan error
    res.status(400).send('Kode akses tidak valid');
  }
});

module.exports = router;
