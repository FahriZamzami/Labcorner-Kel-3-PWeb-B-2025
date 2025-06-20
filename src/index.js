// src/index.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/router');

const {
    getAllAssignments,
    editAssignmentForm,
    updateAssignment,
    deleteAssignment,
    detailAssignment  // ✅ tambahkan ini
} = require('./controllers/assignment.controller');

const { login } = require('./controllers/authentication.controller');
const { isAuthenticated } = require('./middlewares/auth');
const upload = require('./middlewares/upload');

const { labPage, showHomeClassPage } = require('./controllers/lab.controller');

const app = express();

// ===== Middleware & Config =====
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

// Scheduler (penutup otomatis tugas)
require('./scheduler');

// ===== ROUTES =====

// === Auth ===
app.get('/login', (req, res) => res.render('login'));
app.post('/login', login);

// Middleware auth (proteksi semua route di bawah ini)
app.use(isAuthenticated);

// === Assignment Routes ===
app.get('/assignments', getAllAssignments);
app.get('/assignments/create', (req, res) => {
    res.render('addAssignment', { user: req.session.user });
});
app.get('/assignments/:id/edit', editAssignmentForm);
app.get('/penugasan/detail/:id', detailAssignment);  // ✅ tambahkan ini
app.post('/penugasan/edit/:id', upload.single('fileTugas'), updateAssignment);
app.post('/penugasan/delete/:id', deleteAssignment);

// === Lab & Kelas ===
app.get('/lab', labPage);
app.get('/kelas/:id', showHomeClassPage);

// === API Routes (REST-style) ===
app.use('/api', router);

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