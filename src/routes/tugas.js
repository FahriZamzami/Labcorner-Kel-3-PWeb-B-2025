// src/routes/tugas.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dummy data tugas
const daftarTugas = [
  { id: 1, judul: "Instruksi Pertemuan 1", deadline: "20 Juni 2025 pukul 23.59 WIB", instruksiLink: "/uploads/instruksi_pertemuan1.pdf", instruksiNama: "Instruksi Pertemuan 1.pdf" },
  { id: 2, judul: "Instruksi Pertemuan 2", deadline: "20 Juni 2025 pukul 23.59 WIB", instruksiLink: "/uploads/instruksi_pertemuan2.pdf", instruksiNama: "Instruksi Pertemuan 2.pdf" },
  { id: 3, judul: "Instruksi Pertemuan 3", deadline: "20 Juni 2025 pukul 23.59 WIB", instruksiLink: "/uploads/instruksi_pertemuan3.pdf", instruksiNama: "Instruksi Pertemuan 3.pdf" },
];

// Setup storage untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Menyimpan file di folder 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  }
});

const upload = multer({ storage: storage });

// Route utama
router.get('/', (req, res) => {
  res.render('tugas', { daftarTugas });
});

// Route untuk halaman detail tugas
router.get('/:id', (req, res) => {
  const tugasId = req.params.id;
  const tugasDetail = daftarTugas.find(tugas => tugas.id == tugasId);
  if (tugasDetail) {
    res.render('detailTugas', { tugas: tugasDetail });
  } else {
    res.status(404).send('Tugas tidak ditemukan');
  }
});

// Route untuk mengunggah file tugas
router.post('/:id/upload', upload.single('file'), (req, res) => {
  const tugasId = req.params.id;
  const tugasDetail = daftarTugas.find(tugas => tugas.id == tugasId);

  if (tugasDetail) {
    // Simpan file yang diunggah ke tugas
    tugasDetail.userFile = req.file.filename;
    tugasDetail.userFileLink = '/uploads/' + req.file.filename;
    tugasDetail.userFileIcon = req.file.mimetype === 'application/pdf' ? '/img/pdf-icon.png' : '/img/gdoc-icon.png'; // Tentukan ikon file
    tugasDetail.userFileNama = req.file.originalname;

    res.json({ message: 'File berhasil diunggah', file: tugasDetail });
  } else {
    res.status(404).send('Tugas tidak ditemukan');
  }
});

// Route untuk menghapus file tugas
router.delete('/:id/hapus', (req, res) => {
  const tugasId = req.params.id;
  const tugasDetail = daftarTugas.find(tugas => tugas.id == tugasId);

  if (tugasDetail && tugasDetail.userFile) {
    const filePath = path.join(__dirname, '..', 'uploads', tugasDetail.userFile);
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Gagal menghapus file' });
      }

      // Hapus file dari data tugas
      delete tugasDetail.userFile;
      delete tugasDetail.userFileLink;
      delete tugasDetail.userFileIcon;
      delete tugasDetail.userFileNama;

      res.json({ message: 'File berhasil dihapus' });
    });
  } else {
    res.status(404).json({ message: 'File tidak ditemukan' });
  }
});

// Route untuk mengunduh file tugas
router.get('/:id/unduh', (req, res) => {
  const tugasId = req.params.id;
  const tugasDetail = daftarTugas.find(tugas => tugas.id == tugasId);

  if (tugasDetail && tugasDetail.userFile) {
    const filePath = path.join(__dirname, '..', 'uploads', tugasDetail.userFile);
    res.download(filePath); // Mengunduh file
  } else {
    res.status(404).send('File tidak ditemukan');
  }
});

module.exports = router;