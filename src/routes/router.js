const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
<<<<<<< HEAD
=======
const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const prisma = new PrismaClient();

// === Assignment Routes ===
const assignmentsController = require('../controllers/assignment.controller');
router.get('/assignments', assignmentsController.getAllAssignments);
router.post('/assignments', upload.single('fileTugas'), assignmentsController.createAssignment);
>>>>>>> d58c348 (new update)

// === Auth Routes ===
const authenticationController = require('../controllers/authentication.controller');
router.post('/login', authenticationController.login);

<<<<<<< HEAD
=======
// === Lab Routes ===
const labController = require('../controllers/lab.controller');
router.get('/lab', labController.labPage);
router.get('/lab/:id', labController.showHomeClassPage);

// === Mahasiswa / Absensi Routes ===

// Filter mahasiswa by semester
router.get('/filter-semester', async (req, res) => {
  const semester = req.query.semester;

  try {
    if (!semester) return res.render('mahasiswa', { mahasiswa: [] });

    const absensi = await prisma.absensi.findMany({
      where: {
        jadwal: { semester },
        user: { peran: 'mahasiswa' }
      },
      include: {
        user: true,
        jadwal: true
      }
    });

    const mahasiswa = absensi.map(item => ({
      id: item.id,
      nama: item.user.username,
      status: item.status
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (err) {
    console.error('Error get by semester:', err);
    res.render('mahasiswa', { mahasiswa: [] });
  }
});

// Search mahasiswa by name
router.get('/mahasiswa', async (req, res) => {
  const keyword = req.query.q || '';
  try {
    const result = await prisma.user.findMany({
      where: {
        peran: 'mahasiswa',
        username: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    });

    const mahasiswa = result.map(user => ({
      id: user.id,
      nama: user.username,
      status: '-' // default, belum ada absensi
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (err) {
    console.error('Error search mahasiswa:', err);
    res.render('mahasiswa', { mahasiswa: [] });
  }
});

// Update status absensi
router.post('/update-status/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await prisma.absensi.update({
      where: { id },
      data: { status }
    });

    res.redirect('back');
  } catch (err) {
    console.error('Error update status:', err);
    res.status(500).send('Gagal update absensi.');
  }
});

// Export ke Excel
router.get('/export/excel', async (req, res) => {
  try {
    const absensi = await prisma.absensi.findMany({
      include: { user: true }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Absensi');

    sheet.columns = [
      { header: 'No', key: 'no', width: 10 },
      { header: 'Nama', key: 'nama', width: 30 },
      { header: 'Status', key: 'status', width: 20 }
    ];

    absensi.forEach((a, i) => {
      sheet.addRow({ no: i + 1, nama: a.user.username, status: a.status });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rekap-absen.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error export Excel:', err);
    res.status(500).send('Gagal export Excel.');
  }
});

// Export ke PDF
router.get('/export/pdf', async (req, res) => {
  try {
    const absensi = await prisma.absensi.findMany({
      include: { user: true }
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename=rekap-absen.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(18).text('Rekap Kehadiran Mahasiswa', { align: 'center' }).moveDown();

    absensi.forEach((a, i) => {
      doc.fontSize(12).text(`${i + 1}. ${a.user.username} - ${a.status}`);
    });

    doc.end();
  } catch (err) {
    console.error('Error export PDF:', err);
    res.status(500).send('Gagal export PDF.');
  }
});

const rekapController = require('../controllers/rekapmahasiswa');
router.get('/rekap-mahasiswa', rekapController.rekapMahasiswa);

>>>>>>> d58c348 (new update)
module.exports = router;