// src/routes/tugas.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads'); // Pastikan path benar
    // Buat direktori 'uploads' jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Menyimpan file di folder 'uploads' di root proyek
  },
  filename: function (req, file, cb) {
    // Memberi nama file unik dengan timestamp + nama asli
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware dummy untuk mendapatkan user_id (HARUS DIGANTI DENGAN AUTENTIKASI ASLI)
router.use((req, res, next) => {
  // Ini adalah placeholder. Di aplikasi nyata, Anda akan mendapatkan user_id dari sesi login.
  // Contoh: req.user.id jika menggunakan Passport.js, atau dari session lain.
  req.user = { id: 'dummyUser123' }; // <--- PENTING: GANTI INI DENGAN LOGIKA OTENTIKASI SESUNGGUHNYA!
  next();
});

// Route utama: Menampilkan daftar tugas
router.get('/', async (req, res) => {
  try {
    const daftarTugas = await prisma.tugas.findMany({
      orderBy: {
        batas_waktu: 'asc' // Urutkan berdasarkan batas waktu
      }
    });

    // Format tanggal batas_waktu agar mudah dibaca di EJS
    const formattedTugas = daftarTugas.map(tugas => ({
      ...tugas,
      batas_waktu_formatted: tugas.batas_waktu.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Gunakan format 24 jam
      }) + ' WIB'
    }));

    res.render('tugas', { daftarTugas: formattedTugas });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil daftar tugas.');
  }
});

// Route untuk halaman detail tugas
router.get('/:id', async (req, res) => {
  const tugasId = parseInt(req.params.id);
  const userId = req.user.id; // Ambil user_id dari middleware

  if (isNaN(tugasId)) {
    return res.status(400).send('ID tugas tidak valid.');
  }

  try {
    const tugasDetail = await prisma.tugas.findUnique({
      where: {
        id: tugasId
      },
      include: {
        pengumpulan: {
          where: {
            user_id: userId // Filter pengumpulan berdasarkan user_id yang sedang login
          }
        }
      }
    });

    if (tugasDetail) {
      // Format batas_waktu untuk detail tugas
      tugasDetail.batas_waktu_formatted = tugasDetail.batas_waktu.toLocaleString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' WIB';

      // Cek apakah mahasiswa sudah mengumpulkan tugas ini
      const submittedFile = tugasDetail.pengumpulan.length > 0 ? tugasDetail.pengumpulan[0] : null;

      res.render('detailTugas', { tugas: tugasDetail, submittedFile: submittedFile });
    } else {
      res.status(404).send('Tugas tidak ditemukan');
    }
  } catch (error) {
    console.error('Error fetching task detail:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil detail tugas.');
  }
});

// Route untuk mengunggah file tugas
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  const tugasId = parseInt(req.params.id);
  const userId = req.user.id; // Ambil user_id dari middleware

  if (isNaN(tugasId)) {
    return res.status(400).json({ message: 'ID tugas tidak valid.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
  }

  try {
    // Cek apakah tugasnya ada
    const tugasExists = await prisma.tugas.findUnique({
      where: { id: tugasId }
    });

    if (!tugasExists) {
      // Hapus file yang sudah terlanjur diupload jika tugas tidak ditemukan
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
    }

    // Cek apakah mahasiswa sudah pernah mengumpulkan tugas ini
    const existingSubmission = await prisma.pengumpulan.findFirst({
      where: {
        tugas_id: tugasId,
        user_id: userId
      }
    });

    let submission;
    if (existingSubmission) {
      // Jika sudah ada, update pengumpulan yang sudah ada
      // Hapus file lama jika ada
      if (existingSubmission.file_path) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', existingSubmission.file_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`File lama dihapus: ${oldFilePath}`);
        }
      }

      submission = await prisma.pengumpulan.update({
        where: { id: existingSubmission.id },
        data: {
          file_path: req.file.filename,
          waktu_kirim: new Date()
        }
      });
      console.log('Pengumpulan diperbarui:', submission);
    } else {
      // Jika belum ada, buat entri pengumpulan baru
      submission = await prisma.pengumpulan.create({
        data: {
          tugas_id: tugasId,
          user_id: userId,
          file_path: req.file.filename,
          waktu_kirim: new Date()
        }
      });
      console.log('Pengumpulan baru dibuat:', submission);
    }

    res.status(200).json({
      message: 'File berhasil diunggah dan disimpan.',
      submission: submission
    });

  } catch (error) {
    console.error('Error uploading file and saving to DB:', error);
    // Jika ada error, hapus file yang sudah terupload
    if (req.file) {
      fs.unlinkSync(req.file.path);
      console.error(`File yang gagal diunggah dihapus: ${req.file.path}`);
    }
    res.status(500).json({ message: 'Gagal mengunggah file atau menyimpan ke database.' });
  }
});

// Route untuk menghapus pengumpulan tugas (dan file fisik)
router.delete('/:id/hapus', async (req, res) => {
  const tugasId = parseInt(req.params.id);
  const userId = req.user.id; // Ambil user_id dari middleware

  if (isNaN(tugasId)) {
    return res.status(400).json({ message: 'ID tugas tidak valid.' });
  }

  try {
    const submission = await prisma.pengumpulan.findFirst({
      where: {
        tugas_id: tugasId,
        user_id: userId
      }
    });

    if (submission) {
      // Hapus file fisik jika ada
      if (submission.file_path) {
        const filePath = path.join(__dirname, '..', 'uploads', submission.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`File fisik dihapus: ${filePath}`);
        }
      }

      // Hapus entri dari database
      await prisma.pengumpulan.delete({
        where: {
          id: submission.id
        }
      });
      console.log('Pengumpulan dihapus dari database:', submission.id);
      res.status(200).json({ message: 'File dan pengumpulan berhasil dihapus.' });
    } else {
      res.status(404).json({ message: 'Pengumpulan tidak ditemukan.' });
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Gagal menghapus file atau pengumpulan dari database.' });
  }
});

// Route untuk mengunduh file tugas yang dikumpulkan
router.get('/:id/unduh', async (req, res) => {
  const tugasId = parseInt(req.params.id);
  const userId = req.user.id; // Ambil user_id dari middleware

  if (isNaN(tugasId)) {
    return res.status(400).send('ID tugas tidak valid.');
  }

  try {
    const submission = await prisma.pengumpulan.findFirst({
      where: {
        tugas_id: tugasId,
        user_id: userId
      }
    });

    if (submission && submission.file_path) {
      const filePath = path.join(__dirname, '..', 'uploads', submission.file_path);
      // Pastikan file tersebut benar-benar ada di server sebelum dikirim
      if (fs.existsSync(filePath)) {
        res.download(filePath, submission.file_path); // Menambahkan nama file untuk unduhan
      } else {
        console.warn(`File fisik tidak ditemukan di: ${filePath}`);
        res.status(404).send('File fisik tidak ditemukan di server.');
      }
    } else {
      res.status(404).send('Pengumpulan atau file tidak ditemukan.');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Terjadi kesalahan saat mengunduh file.');
  }
});

module.exports = router;