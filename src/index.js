const express = require('express');
const path = require('path');
const fs = require('fs'); // <- Tambahkan ini
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const port = 3000;

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



// ✅ Semua route biasa tetap di bawah
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
