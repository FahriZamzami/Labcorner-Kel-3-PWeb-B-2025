// src/routes/tugas.js
const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasController');

// Middleware dummy untuk mendapatkan user_id (HARUS DIGANTI DENGAN AUTENTIKASI ASLI)
router.use((req, res, next) => {
  // PENTING: Sesuaikan 'id' di sini dengan tipe data kolom user_id di tabel `pengumpulan` Anda!
  req.user = { id: 'user1' }; // Contoh: string ID sesuai dengan schema Prisma
  // req.user = { id: 1 }; // Contoh: integer ID
  next();
});

// Route utama: Menampilkan daftar tugas
router.get('/', tugasController.getDaftarTugas);

// Route untuk halaman detail tugas
router.get('/:id', tugasController.getDetailTugas);

// Route untuk mengunggah file tugas
router.post('/:id/upload', tugasController.uploadFile);

// Route untuk menghapus pengumpulan tugas (dan file fisik)
router.delete('/:id/hapus', tugasController.hapusPengumpulan);

// Route untuk mengunduh file tugas yang dikumpulkan
router.get('/:id/unduh', tugasController.unduhFile);

module.exports = router;