const express = require('express');
const router = express.Router();
const mahasiswaLab = require('../controllers/mahasiswaLab.controller');

// Middleware pengecekan sesi mahasiswa (opsional)
const cekMahasiswa = (req, res, next) => {
  if (req.session?.user?.peran !== 'mahasiswa') return res.redirect('/login');
  next();
};

router.get('/laboratorium', cekMahasiswa, mahasiswaLab.getDaftarLab);
router.get('/laboratorium/:id', cekMahasiswa, mahasiswaLab.getDetailLab);
router.get('/rekap-absensi', cekMahasiswa, mahasiswaLab.getRekapAbsensi);
router.get('/rekap-nilai', cekMahasiswa, mahasiswaLab.getRekapNilai);

module.exports = router;