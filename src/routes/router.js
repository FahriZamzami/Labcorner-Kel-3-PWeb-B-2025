const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
<<<<<<< HEAD
<<<<<<< HEAD
=======
const { PrismaClient } = require('@prisma/client');
=======
>>>>>>> 7d0a91d (update mahasiswa)
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const assignmentsController = require('../controllers/assignment.controller');
const authenticationController = require('../controllers/authentication.controller');
const labController = require('../controllers/lab.controller');
const mahasiswa = require('../controllers/mahasiswa.controller');
const ekspor = require('../controllers/export.controller');

// === Assignment Routes ===
router.get('/assignments', assignmentsController.getAllAssignments);
router.post('/assignments', upload.single('fileTugas'), assignmentsController.createAssignment);
>>>>>>> d58c348 (new update)

// === Auth Routes ===
router.post('/login', authenticationController.login);

<<<<<<< HEAD
=======
// === Lab Routes ===
router.get('/lab', labController.labPage);
router.get('/lab/:id', labController.showHomeClassPage);

// === Mahasiswa / Absensi Routes ===
router.get('/mahasiswa', mahasiswa.searchMahasiswa);
router.get('/filter-semester', mahasiswa.getMahasiswaBySemester);
router.post('/update-status/:id', mahasiswa.updateStatusMahasiswa);
router.get('/mahasiswa/rekap', mahasiswa.getDaftarMahasiswa); 

// === Export Routes ===
router.get('/export/pdf', ekspor.exportPDF);
router.get('/export/excel', ekspor.exportExcel);

<<<<<<< HEAD
>>>>>>> d58c348 (new update)
=======
// === Export router ONLY ===
>>>>>>> 7d0a91d (update mahasiswa)
module.exports = router;