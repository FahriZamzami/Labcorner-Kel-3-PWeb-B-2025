const express = require('express');
const router = express.Router();

// Halaman Utama (Dashboard)
router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// Halaman Informasi
router.get('/informasi', (req, res) => {
  res.render('informasi', { title: 'Informasi Lab' });
});

// Fitur User
router.get('/user', (req, res) => res.render('user', { title: 'Semua User' }));
router.get('/user/tambah', (req, res) => res.render('user_tambah', { title: 'Tambah User' }));
router.get('/user/hapus', (req, res) => res.render('user_hapus', { title: 'Hapus User' }));

// Fitur Pengumuman
router.get('/pengumuman', (req, res) => res.render('pengumuman', { title: 'Pengumuman' }));
router.post('/pengumuman', (req, res) => {
  console.log(req.body); // nanti simpan ke database
  res.redirect('/');
});

// Maintenance
router.get('/maintenance', (req, res) => res.render('maintenance', { title: 'Maintenance Website' }));
router.post('/maintenance', (req, res) => {
  console.log(req.body); // simpan status/jadwal maintenance
  res.redirect('/');
});

// Matikan Website
router.get('/matikan', (req, res) => res.render('matikan', { title: 'Matikan Website' }));
router.post('/matikan', (req, res) => {
  console.log("Website dimatikan");
  res.redirect('/');
});

// Detail Tiap Lab
const labDetails = {
  lea: {
    nama: 'LEA',
    deskripsi: 'Laboratorium Enterprise Application (LEA) mendalami pengembangan sistem enterprise berbasis Java, Spring, dan ERP.',
    jadwal: 'Senin & Rabu - 08:00 s/d 12:00',
    dosen: 'Ir. Andika Pratama, M.T.',
    jumlahAsisten: 3,
    jumlahModul: 5,
    jumlahKelas: 2,
    asisten: ['Andi Saputra', 'Budi Santoso', 'Citra Dewi'],
    mahasiswa: ['Nina Zulaika', 'Rizki Hadi', 'Lutfi Yulianto', 'Tasya Nurhaliza'],
    jadwalKelas: ['Senin 08:00 - 10:00', 'Rabu 10:00 - 12:00']
  },
  labgis: {
    nama: 'LABGIS',
    deskripsi: 'Laboratorium Geographic Information System (GIS) fokus pada pengolahan data spasial, pemetaan digital, dan pemanfaatan teknologi geospasial.',
    jadwal: 'Selasa & Kamis - 10:00 s/d 14:00',
    dosen: 'Dr. Rina Marlina, M.Kom',
    jumlahAsisten: 2,
    jumlahModul: 4,
    jumlahKelas: 1,
    asisten: ['Wahyu Nugroho', 'Siska Ayuni'],
    mahasiswa: ['Rahmat Hidayat', 'Eka Yuliana', 'Zaki Ramadhan'],
    jadwalKelas: ['Kamis 10:00 - 12:00']
  },
  lbi: {
    nama: 'LBI',
    deskripsi: 'Laboratorium Business Intelligence menyediakan sarana belajar data warehouse, analitik, dan big data tools seperti Tableau & Power BI.',
    jadwal: 'Senin - Jumat - 09:00 s/d 16:00',
    dosen: 'Budi Hartono, S.Kom., M.T.',
    jumlahAsisten: 4,
    jumlahModul: 6,
    jumlahKelas: 3,
    asisten: ['Rian Saputra', 'Dewi Lestari', 'Ahmad Fauzi', 'Fitri Rahmawati'],
    mahasiswa: ['Aldi Permana', 'Dina Novitasari', 'Hendra Wijaya', 'Maya Sari'],
    jadwalKelas: ['Senin 10:00 - 12:00', 'Rabu 13:00 - 15:00', 'Jumat 14:00 - 16:00']
  },
  ldkom: {
    nama: 'LDKOM',
    deskripsi: 'Laboratorium Dasar Komputasi (LDKOM) fokus pada pembelajaran logika algoritma, UI/UX design, dan pembuatan prototipe interaktif.',
    jadwal: 'Rabu & Jumat - 13:00 s/d 17:00',
    dosen: 'Dr. Yuni Puspita, M.Sn.',
    jumlahAsisten: 3,
    jumlahModul: 3,
    jumlahKelas: 2,
    asisten: ['Yusuf Ramadhan', 'Lisa Marlina', 'Indra Gunawan'],
    mahasiswa: ['Winda Putri', 'Fajar Nugraha', 'Siti Khadijah', 'Yoga Pratama'],
    jadwalKelas: ['Rabu 13:00 - 15:00', 'Jumat 15:00 - 17:00']
  }
};

// Route Lab Detail
router.get('/lab/:nama', (req, res) => {
  const detail = labDetails[req.params.nama.toLowerCase()];
  if (!detail) return res.status(404).send('Lab tidak ditemukan');
  res.render('lab_detail', {
    title: `Detail ${detail.nama}`,
    lab: detail
  });
});

module.exports = router;
