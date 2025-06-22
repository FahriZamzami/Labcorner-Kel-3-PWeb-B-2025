const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
