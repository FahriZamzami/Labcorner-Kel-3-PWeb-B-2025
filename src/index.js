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
const rekapNilaiRoutes = require('./routes/rekapNilai.routes');
const dashboardKelasRoutes = require('./routes/dashboardKelas.routes');

// Import controllers
const homeController = require('./controllers/homeController');
const { login } = require('./controllers/authentication.controller');

// Menambahkan route untuk berbagai fungsionalitas
app.use('/pilihLab', pilihLabRoutes);
app.use('/modulMateri', modulMateriRoutes);
app.use('/tugas', tugasRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/jadwal', jadwalRoutes);
app.use('/rekapNilai', rekapNilaiRoutes);
app.use('/dashboard-kelas', dashboardKelasRoutes);

// --- Definisi Route Utama Aplikasi ---

// Route utama - redirect ke pilih lab
app.get('/', (req, res) => {
    res.redirect('/pilihLab');
});

// Route untuk halaman login
app.get('/login', (req, res) => {
    res.render('login');
});

// Route untuk halaman login mahasiswa
app.get('/login-mahasiswa-page', (req, res) => {
    res.render('loginMahasiswa');
});

// Route untuk proses login
app.post('/login', login);

// Route untuk proses login mahasiswa
app.post('/login-mahasiswa', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username
        const user = await prisma.user.findFirst({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        // Pastikan user adalah mahasiswa
        if (user.peran !== 'mahasiswa') {
            return res.status(403).json({
                success: false,
                message: 'Akun ini bukan akun mahasiswa'
            });
        }

        // Untuk sementara, password validation diabaikan (untuk testing)
        // Dalam implementasi nyata, gunakan bcrypt untuk compare password

        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            peran: user.peran
        };

        console.log('Login mahasiswa berhasil untuk:', user.username);

        res.json({
            success: true,
            message: 'Login berhasil!',
            redirectUrl: '/dashboard-kelas',
            user: {
                username: user.username,
                peran: user.peran
            }
        });

    } catch (error) {
        console.error('Error in login mahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login'
        });
    }
});

// Route untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

// Route sementara untuk bypass login (UNTUK TESTING SAJA)
app.get('/test-login', async (req, res) => {
    try {
        console.log('=== TEST LOGIN ROUTE ===');
        
        // Cari user mahasiswa pertama
        const mahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });

        if (mahasiswa) {
            // Set session user dengan format yang benar
            const sessionUser = {
                id: mahasiswa.id,
                username: mahasiswa.username,
                peran: mahasiswa.peran
            };
            
            req.session.user = sessionUser;
            
            console.log('✅ Test login berhasil untuk:', mahasiswa.username);
            console.log('✅ Session user diset:', JSON.stringify(sessionUser, null, 2));
            console.log('✅ Session ID:', req.sessionID);
            
            // Simpan session sebelum redirect
            req.session.save((err) => {
                if (err) {
                    console.error('❌ Error saving session:', err);
                    return res.send('Error saving session: ' + err.message);
                }
                console.log('✅ Session saved successfully');
                res.redirect('/dashboard-kelas');
            });
        } else {
            console.log('❌ Tidak ada user mahasiswa di database');
            res.send('Tidak ada user mahasiswa di database');
        }
    } catch (error) {
        console.error('❌ Error test login:', error);
        res.send('Error: ' + error.message);
    }
});

// Route untuk login cepat (demo)
app.get('/login-mahasiswa', async (req, res) => {
    try {
        // Cari user mahasiswa pertama
        const mahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });

        if (mahasiswa) {
            // Set session user
            req.session.user = {
                id: mahasiswa.id,
                username: mahasiswa.username,
                peran: mahasiswa.peran
            };
            
            console.log('Login cepat mahasiswa berhasil untuk:', mahasiswa.username);
            res.redirect('/dashboard-kelas');
        } else {
            res.send('Tidak ada user mahasiswa di database');
        }
    } catch (error) {
        console.error('Error login cepat mahasiswa:', error);
        res.send('Error: ' + error.message);
    }
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