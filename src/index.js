const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware cek status offline sebelum route lain
const statusFile = path.join(__dirname, '..', 'status.json');

function checkSiteStatus(req, res, next) {
  fs.readFile(statusFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal baca status.json', err);
      return next();
    }
    try {
      const status = JSON.parse(data);
      if (
        status.isOffline && 
        req.path !== '/matikan' && 
        !(req.path === '/matikan/aktifkan' && req.method === 'POST')
      ) {
        return res.render('maintenance', { title: 'Maintenance Website' });
      }
      next();
    } catch (e) {
      console.error('Error parsing status.json', e);
      next();
    }
  });
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  secret: 'labcorner-secret',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(checkSiteStatus);

app.use('/', indexRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // If it's an API route, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  }
  
  // For regular routes, render error page
  res.status(500).render('error', {
    title: 'Error',
    message: 'Terjadi kesalahan pada server',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint tidak ditemukan'
    });
  }
  
  res.status(404).render('error', {
    title: '404 Not Found',
    message: 'Halaman tidak ditemukan',
    error: 'Halaman yang Anda cari tidak ada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
