const express = require('express');
const path = require('path');
const session = require('express-session');
const router = require('./routes/router');
const { getAllAssignments } = require('./controllers/assignment.controller');
const { login } = require('./controllers/authentication.controller');
const { isAuthenticated } = require('./middlewares/auth');
const { labPage, showHomeClassPage } = require('./controllers/lab.controller');

const app = express();
const port = 3000;

// Session config
app.use(session({
  secret: 'rahasia_super_aman',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Middleware untuk parsing body dan serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === Routes ===

// Login (GET & POST)
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', login);

// Proteksi semua route selanjutnya
app.use(isAuthenticated);

// API route utama
app.use('/api', router);

// Tambah penugasan (form)
app.get('/assignments/create', (req, res) => {
  res.render('addAssignment', { user: req.session.user });
});

// Laman lab & kelas
app.get('/lab', labPage);
app.get('/kelas/:id', showHomeClassPage);

// Daftar tugas
app.get('/assignments', getAllAssignments);

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Redirect shortcut (tanpa prefix /api)
app.get('/mahasiswa', (req, res) => res.redirect('/api/mahasiswa'));
app.get('/mahasiswa/rekap', (req, res) => res.redirect('/api/mahasiswa/rekap'));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:3000`);
});