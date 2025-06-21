// src/index.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
// const dotenv = require('dotenv');
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

// --- Konfigurasi Aplikasi Express ---

// Set engine view EJS
app.set('view engine', 'ejs');
// PATH views: Karena index.js ini ada di `src/`, dan views di `src/views/`
app.set('views', path.join(__dirname, 'views')); // KOREKSI: path.join(__dirname, 'views')

// Middleware untuk parsing body dari request HTTP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-dengan-secret-key-yang-sangat-aman-dan-panjang',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// --- Serve Static Files ---
// PATH UPLOADS: Karena index.js ini ada di `src/`, dan uploads di `project_root/public/uploads/`
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads'))); // KOREKSI: path.join(__dirname, '..', 'public', 'uploads')

// Serve file statis lainnya (misal CSS, JS client-side, gambar) dari folder 'public' di 'src'
app.use(express.static(path.join(__dirname, 'public')));

// --- Import dan Gunakan Route Files ---
// PATH ROUTES: Karena index.js ini ada di `src/`, dan routes di `src/routes/`
const pilihLabRoutes = require('./routes/pilihLab'); // KOREKSI: require('./routes/pilihLab')
const modulMateriRoutes = require('./routes/modulMateri'); // KOREKSI
const tugasRoutes = require('./routes/tugas'); // KOREKSI

// Menambahkan route untuk berbagai fungsionalitas
app.use('/pilihLab', pilihLabRoutes);
app.use('/modulMateri', modulMateriRoutes);
app.use('/tugas', tugasRoutes);

// --- Definisi Route Utama Aplikasi ---

// Route utama - redirect ke pilih lab
app.get('/', (req, res) => {
  res.redirect('/pilihLab');
});

// Halaman utama setelah bergabung dengan lab
app.get('/home', (req, res) => {
  const currentLab = req.session.currentLab;
  if (!currentLab) {
    return res.redirect('/pilihLab');
  }
  res.render('home', { currentLab, currentPage: 'home' });
});

// --- Penanganan Error (TANPA error.ejs) ---

// Middleware untuk menangani request ke path yang tidak ditemukan (404 Not Found)
app.use((req, res, next) => {
  res.status(404).send('404 Not Found: Halaman tidak ditemukan.');
});

// Middleware penanganan error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Internal Server Error: Terjadi kesalahan pada server. ' + (process.env.NODE_ENV === 'development' ? err.message : ''));
});

// --- Penanganan Error untuk Prisma Client Disconnect ---
process.on('SIGINT', async () => {
  console.log('Server dimatikan. Memutuskan koneksi Prisma...');
  await prisma.$disconnect();
  console.log('Koneksi Prisma terputus.');
  process.exit(0);
});

// --- Menjalankan Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
