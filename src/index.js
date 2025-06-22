// src/index.js (Perbarui)
const express = require('express');
const path = require('path');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
// const dotenv = require('dotenv');
// dotenv.config(); // Aktifkan jika Anda menggunakan file .env

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

// --- Konfigurasi Aplikasi Express ---

// Set engine view EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk parsing body dari request HTTP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'ganti-dengan-secret-key-yang-sangat-aman-dan-panjang',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true jika HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 jam
    }
}));

// Middleware untuk flash messages (simulasi flash, jika tidak pakai connect-flash)
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Middleware untuk flash messages (implementasi sederhana jika belum pakai connect-flash)
app.use((req, res, next) => {
    req.flash = (type, message) => {
        req.session.message = { type, text: message };
    };
    next();
});

// --- Serve Static Files ---
// Asumsi: folder 'public' berada di root proyek (satu level di atas 'src')
// Maka untuk mengakses file di 'public/css', 'public/uploads', dll.
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Import dan Gunakan Route Files ---
const pilihLabRoutes = require('./routes/pilihLab');
const modulMateriRoutes = require('./routes/modulMateri');
const tugasRoutes = require('./routes/tugas');
const dashboardRoutes = require('./routes/dashboard.routes');
const jadwalRoutes = require('./routes/jadwal.routes');

// Import controllers
const homeController = require('./controllers/homeController');

// Menambahkan route untuk berbagai fungsionalitas
app.use('/pilihLab', pilihLabRoutes);
app.use('/modulMateri', modulMateriRoutes);
app.use('/tugas', tugasRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/jadwal', jadwalRoutes);

// --- Definisi Route Utama Aplikasi ---

// Route utama - redirect ke pilih lab
app.get('/', (req, res) => {
    res.redirect('/pilihLab');
});

// Halaman utama setelah bergabung dengan lab
app.get('/home', homeController.getHome);

// --- Penanganan Error ---
app.use((req, res, next) => {
    res.status(404).send('404 Not Found: Halaman tidak ditemukan.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 Internal Server Error: Terjadi kesalahan pada server. ' + (process.env.NODE_ENV === 'development' ? err.message : ''));
});

// --- Penanganan Koneksi Prisma ---
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