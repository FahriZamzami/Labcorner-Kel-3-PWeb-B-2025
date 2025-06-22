const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// === Auth Routes ===
const authenticationController = require('../controllers/authentication.controller');
router.post('/login', authenticationController.login);

// Import routes
const mahasiswaRoutes = require('./mahasiswa.routes');
const dashboardRoutes = require('./dashboard.routes');
const jadwalRoutes = require('./jadwal.routes');
const rekapNilaiRoutes = require('./rekapNilai.routes');
const modulMateriRoutes = require('./modulMateri');
const tugasRoutes = require('./tugas');
const pilihLabRoutes = require('./pilihLab');
const dashboardKelasRoutes = require('./dashboardKelas.routes');

// Mount routes
router.use('/mahasiswa', mahasiswaRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/jadwal', jadwalRoutes);
router.use('/rekapNilai', rekapNilaiRoutes);
router.use('/modulMateri', modulMateriRoutes);
router.use('/tugas', tugasRoutes);
router.use('/pilihLab', pilihLabRoutes);
router.use('/dashboardKelas', dashboardKelasRoutes);

module.exports = router;