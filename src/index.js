// src/index.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/router');
const { getAllAssignments } = require('./controllers/assignment.controller');
const { login } = require('./controllers/authentication.controller');
const { isAuthenticated } = require('./middlewares/auth'); // Middleware auth
const port = 3000;

const app = express();

// Session config
app.use(session({
    secret: 'rahasia_super_aman',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/api', indexRouter);

// Middleware parsing JSON dan form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route login (GET dan POST)
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', login);

// Proteksi route berikutnya
app.use(isAuthenticated);

// Routing API (setelah login)
app.use('/api', router);

// Halaman form tambah penugasan (hanya jika login)
app.get('/assignments/create', (req, res) => {
    res.render('addAssignment', { user: req.session.user });
});

const { labPage } = require('./controllers/lab.controller');

app.get('/lab', labPage);

const { showHomeClassPage } = require('./controllers/lab.controller');
app.get('/kelas/:id', showHomeClassPage);

// Halaman daftar penugasan (juga perlu login)
app.get('/assignments', getAllAssignments);

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/mahasiswa', (req, res) => res.redirect('/api/mahasiswa'));
app.get('/mahasiswa/rekap', (req,res) => res.redirect('/api/daftarmahasiswa'))

// Start server
app.listen(3000, () => {
    console.log('🚀 Server berjalan di http://localhost:3000');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

