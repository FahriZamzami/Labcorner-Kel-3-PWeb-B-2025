const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// ===== Controller Imports =====
const {
    getAllAssignments,
    editAssignmentForm,
    updateAssignment,
    deleteAssignment,
    detailAssignment,
    getPengumpulanByTugasId,
    getFilesByTugasId,
    beriNilaiForm,
    simpanNilai,
    createAssignmentForm
} = require('./controllers/assignment.controller');

const {
  // ... sebelumnya
    exportRekapPDF,
    exportRekapExcel,
    tampilkanRekapNilai
} = require('./controllers/praktikum.controller');

const { login } = require('./controllers/authentication.controller');
const { isAuthenticated } = require('./middlewares/auth');
const upload = require('./middlewares/upload');
const { labPage, showHomeClassPage } = require('./controllers/lab.controller');

const apiRouter = require('./routes/router'); // API REST routes (opsional)


// ===== Middleware & Config =====
app.use(session({
    secret: 'rahasia_super_aman',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

const fs = require('fs');

// Route download file aman
app.get('/download/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);

    console.log("🔽 File path requested:", filePath);

    if (fs.existsSync(filePath)) {
        res.download(filePath, filename);
    } else {
        res.status(404).send('File tidak ditemukan');
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== Scheduler (Tutup Otomatis Penugasan) =====
require('./scheduler');


// ===== ROUTES =====

// === Auth ===
app.get('/login', (req, res) => res.render('login'));
app.post('/login', login);

// 🔒 Auth middleware untuk semua route setelah login
app.use(isAuthenticated);
const setCurrentPath = require('./middlewares/currentPage');
app.use(setCurrentPath);


app.get('/assignments/create', createAssignmentForm);
// === Assignment Routes ===
app.get('/assignments', getAllAssignments);

app.get('/assignments/:id/edit', editAssignmentForm);
app.get('/penugasan/detail/:id', detailAssignment);
app.post('/penugasan/edit/:id', upload.single('fileTugas'), updateAssignment);
app.post('/penugasan/delete/:id', deleteAssignment);

// === Pengumpulan (Submissions) ===
app.get('/assignments/:id/pengumpulan', getPengumpulanByTugasId);
app.get('/assignments/:id/files', getFilesByTugasId);
app.get('/assignments/nilai/:id', beriNilaiForm);  // ✅ Tambah ini
app.post('/assignments/nilai/:id', simpanNilai); // ✅ Tambah ini juga

app.get('/praktikum/:id/rekap-nilai', tampilkanRekapNilai);
app.get('/praktikum/:id/rekap-nilai/pdf', exportRekapPDF);     // ✅ route PDF
app.get('/praktikum/:id/rekap-nilai/excel', exportRekapExcel); // ✅ route Excel

// === Lab & Kelas ===
app.get('/lab', labPage);
app.get('/kelas/:id', showHomeClassPage);


// === API (Optional for RESTful JSON routes) ===
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