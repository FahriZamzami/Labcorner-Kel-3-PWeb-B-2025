const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const assignmentsController = require('../controllers/assignment.controller');
const authenticationController = require('../controllers/authentication.controller');
const labController = require('../controllers/lab.controller');
const mahasiswa = require('../controllers/mahasiswa.controller');
const ekspor = require('../controllers/export.controller');

// Assignment Routes
router.get('/assignments', assignmentsController.getAllAssignments);
router.post('/assignments', upload.single('fileTugas'), assignmentsController.createAssignment);

// Auth
router.post('/login', authenticationController.login);

// Lab
router.get('/lab', labController.labPage);
router.get('/lab/:id', labController.showHomeClassPage);

// Mahasiswa
router.get('/mahasiswa', mahasiswa.searchMahasiswa);
router.get('/filter-semester', mahasiswa.getMahasiswaBySemester);
router.post('/update-status/:id', mahasiswa.updateStatusMahasiswa);
router.get('/mahasiswa/rekap', mahasiswa.getDaftarMahasiswa);
router.get('/mahasiswa/rekap/search', mahasiswa.searchMahasiswaRekap);

// Export
router.get('/export/pdf', ekspor.exportPDF);
router.get('/export/excel', ekspor.exportExcel);

module.exports = router;