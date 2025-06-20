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
    getFilesByTugasId
} = require('./controllers/assignment.controller');

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


// === Assignment Routes ===
app.get('/assignments', getAllAssignments);
app.get('/assignments/create', (req, res) => {
    res.render('addAssignment', { user: req.session.user });
});
app.get('/assignments/:id/edit', editAssignmentForm);
app.get('/penugasan/detail/:id', detailAssignment);
app.post('/penugasan/edit/:id', upload.single('fileTugas'), updateAssignment);
app.post('/penugasan/delete/:id', deleteAssignment);

// === Pengumpulan (Submissions) ===
app.get('/assignments/:id/pengumpulan', getPengumpulanByTugasId);
app.get('/assignments/:id/files', getFilesByTugasId);

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