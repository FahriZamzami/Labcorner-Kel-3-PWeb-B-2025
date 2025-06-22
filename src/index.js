const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

const app = express();

// ===== Import Controller =====
const {
    getAllAssignments, editAssignmentForm, updateAssignment, deleteAssignment, detailAssignment,
    getPengumpulanByTugasId, getFilesByTugasId, beriNilaiForm, simpanNilai, createAssignmentForm
} = require('./controllers/assignment.controller');
const { tampilkanRekapNilai, exportRekapExcel, exportRekapPDF } = require('./controllers/praktikum.controller');
const { showRegisterPage, handleFirstStep, handleRegisterCreate } = require('./controllers/register.controller');
const { getModulPage, uploadModul, deleteModul } = require('./controllers/modul.controller');
const { getJadwalPage, createJadwal, getJadwalById, updateJadwal, deleteJadwal } = require('./controllers/jadwal.controller');
const { getPengumumanPage, createPengumuman, deletePengumuman } = require('./controllers/pengumuman.controller');
const { getDaftarMahasiswaPage } = require('./controllers/mahasiswa.controller');
const { getAbsensiPage, saveAbsensi, getDetailKehadiranPage } = require('./controllers/absensi.controller');
const { login } = require('./controllers/authentication.controller');
const { labPage, showHomeClassPage } = require('./controllers/lab.controller');
const { getHomePage } = require('./controllers/home.controller');

// TAMBAHAN: Impor controller untuk halaman Pilih Lab
const { 
    getPilihPraktikumPage, 
    joinPraktikum 
} = require('./controllers/pilihlab.controller');


// ===== Import Middleware & Router Lain =====
const { isAuthenticated } = require('./middlewares/auth');
const upload = require('./middlewares/upload');
const setCurrentPath = require('./middlewares/currentPage');
const apiRouter = require('./routes/router');


// ===== Middleware & Konfigurasi =====
app.use(session({
    secret: 'rahasia_super_aman',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== Route download file aman =====
app.get('/download/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename);
    } else {
        res.status(404).send('File tidak ditemukan');
    }
});

// ===== Scheduler =====
require('./scheduler');

// ===== ROUTES =====
app.get('/', (req, res) => {
    res.redirect('/login');
});

// === Auth ===
app.get('/login', (req, res) => res.render('login'));
app.post('/login', login);
app.get('/register', showRegisterPage);
app.post('/register', handleFirstStep);
app.post('/register/create', handleRegisterCreate);

// 🔒 Semua route setelah ini butuh login
app.use(isAuthenticated);
app.use(setCurrentPath);

// === Halaman Utama Mahasiswa ===
app.get('/home', getHomePage);

// === Halaman Pilih Lab/Praktikum (untuk gabung kelas baru) === (TAMBAHAN BARU)
app.get('/pilihLab', getPilihPraktikumPage);
app.post('/pilihLab/joinLab', joinPraktikum);

// === Lab & Kelas ===
app.get('/lab', labPage);
app.get('/kelas/:id', showHomeClassPage);

// === Modul ===
app.get('/praktikum/:praktikum_id/modul', getModulPage);
app.post('/praktikum/:praktikum_id/modul/upload', upload.single('fileModul'), uploadModul);
app.post('/modul/delete/:modul_id', deleteModul);

// === Pengumuman ===
app.get('/praktikum/:praktikum_id/pengumuman', getPengumumanPage);
app.post('/pengumuman/create', createPengumuman);
app.post('/pengumuman/delete/:id', deletePengumuman);

// === Jadwal ===
app.get('/praktikum/:praktikum_id/jadwal', getJadwalPage);
app.post('/jadwal/create', createJadwal);
app.post('/jadwal/update/:id', updateJadwal);
app.post('/jadwal/delete/:id', deleteJadwal);
app.get('/api/jadwal/:id', getJadwalById);

// === Mahasiswa & Absensi ===
app.get('/praktikum/:praktikum_id/mahasiswa', getDaftarMahasiswaPage);
app.get('/praktikum/:praktikum_id/absensi', getAbsensiPage);
app.post('/absensi/save', saveAbsensi);
app.get('/praktikum/:praktikum_id/absensi/detail', getDetailKehadiranPage);

// === Assignment & Penilaian ===
app.get('/assignments', getAllAssignments);
app.get('/assignments/create', createAssignmentForm);
app.get('/assignments/:id/edit', editAssignmentForm);
app.post('/penugasan/edit/:id', upload.single('fileTugas'), updateAssignment);
app.post('/assignments/delete/:id', deleteAssignment);
app.get('/penugasan/detail/:id', detailAssignment);
app.get('/assignments/:id/pengumpulan', getPengumpulanByTugasId);
app.get('/assignments/:id/files', getFilesByTugasId);
app.get('/assignments/nilai/:id', beriNilaiForm);
app.post('/assignments/nilai/:id', simpanNilai);

// === Rekap Nilai ===
app.get('/praktikum/:id/rekap-nilai', tampilkanRekapNilai);
app.get('/praktikum/:id/rekap-nilai/pdf', exportRekapPDF);
app.get('/praktikum/:id/rekap-nilai/excel', exportRekapExcel);

// === API ===
app.use('/api', apiRouter);

// === Logout ===
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ===== START SERVER =====
app.listen(3000, () => {
    console.log('🚀 Server berjalan di http://localhost:3000');
});