const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { isAuthenticated } = require('../middlewares/auth');

// === Assignment Routes ===
const assignmentsController = require('../controllers/assignment.controller');
router.get('/assignments', assignmentsController.getAllAssignments);
router.post('/assignments', upload.single('fileTugas'), assignmentsController.createAssignment);
router.patch('/assignments/:id/toggle-status', assignmentsController.toggleStatusAssignments);
router.get('/assignments/:id/pengumpulan', assignmentsController.getPengumpulanByTugasId);
router.get('/assignments/:id/files', assignmentsController.getFilesByTugasId);
router.get('/assignments/nilai/:id', assignmentsController.beriNilaiForm);
router.post('/assignments/nilai/:id', assignmentsController.simpanNilai);
router.post('/penugasan/:id/hapus-file', assignmentsController.hapusFile);
router.get('/assignments/create', assignmentsController.createAssignmentForm);
router.post('/assignments/delete/:id', assignmentsController.deleteAssignment);

const praktikumController = require('../controllers/praktikum.controller');
router.get('/praktikum/:id/rekap-nilai', praktikumController.tampilkanRekapNilai);
router.get('/praktikum/:id/rekap-nilai/excel', praktikumController.exportRekapExcel);
router.get('/praktikum/:id/rekap-nilai/pdf', praktikumController.exportRekapPDF);

// === Auth Routes ===
const authenticationController = require('../controllers/authentication.controller');
router.post('/login', authenticationController.login);

// === Lab Routes ===
const labController = require('../controllers/lab.controller');
router.get('/lab', isAuthenticated, labController.labPage);
router.get('/lab/:id', isAuthenticated, labController.showHomeClassPage);

const registerController = require('../controllers/register.controller');
router.get('/', registerController.showRegisterPage);           // Tampilkan halaman awal (step 1)
router.post('/', registerController.handleFirstStep);           // Validasi nama & NIM
router.post('/create', registerController.handleRegisterCreate); // Proses password dan simpan user

const modulController = require('../controllers/modul.controller');
router.get('/praktikum/:praktikum_id/modul', modulController.getModulPage);
router.post('/praktikum/:praktikum_id/modul/upload', upload.single('fileModul'), modulController.uploadModul);
router.post('/modul/delete/:modul_id', modulController.deleteModul);

const jadwalController = require('../controllers/jadwal.controller');
router.get('/praktikum/:praktikum_id/jadwal', jadwalController.getJadwalPage);
router.post('/jadwal/create', jadwalController.createJadwal);
router.post('/jadwal/update/:id', jadwalController.updateJadwal);
router.post('/jadwal/delete/:id', jadwalController.deleteJadwal);
router.get('/api/jadwal/:id', jadwalController.getJadwalById);

const { getDaftarMahasiswaPage } = require('../controllers/mahasiswa.controller');
router.get('/praktikum/:praktikum_id/mahasiswa', getDaftarMahasiswaPage);

const { getAbsensiPage, saveAbsensi } = require('../controllers/absensi.controller');
router.get('/praktikum/:praktikum_id/absensi', getAbsensiPage);
router.post('/absensi/save', saveAbsensi);

module.exports = router;