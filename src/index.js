const express = require('express');
const path = require('path');
const pilihLabRoutes = require('./routes/pilihLab');
const modulMateriRoutes = require('./routes/modulMateri');  // Route untuk Modul Materi
const tugasRoutes = require('./routes/tugas'); // ✅ path benar karena sudah di dalam folder src

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk parsing form data
app.use(express.urlencoded({ extended: true })); // Untuk menangani form data dari POST request

// Menambahkan route untuk tugas
app.use('/tugas', tugasRoutes);

// Menambahkan route untuk Pilih Lab
app.use('/pilihLab', pilihLabRoutes);  // Pastikan route Pilih Lab sudah terdaftar

// Menambahkan route untuk Modul Materi
app.use('/modulMateri', modulMateriRoutes);  // Pastikan route Modul Materi sudah terdaftar

// Halaman utama setelah bergabung dengan lab
app.get('/home', (req, res) => {
  res.render('home');  // Halaman utama setelah berhasil bergabung
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});