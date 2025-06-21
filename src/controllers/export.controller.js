const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.exportExcel = async (req, res) => {
  const data = await prisma.absensi.findMany({ include: { user: true } });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Absensi');

  sheet.columns = [
    { header: 'No', key: 'no', width: 8 },
    { header: 'Nama', key: 'nama', width: 30 },
    { header: 'Status', key: 'status', width: 20 },
  ];

  data.forEach((a, i) => {
    sheet.addRow({ no: i + 1, nama: a.user.username, status: a.status });
  });

  res.setHeader('Content-Disposition', 'attachment; filename=rekap-absen.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  await workbook.xlsx.write(res);
  res.end();
};

exports.exportPDF = async (req, res) => {
  const data = await prisma.absensi.findMany({ include: { user: true } });

  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename=rekap-absen.pdf');
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(res);
  doc.fontSize(18).text('Rekap Kehadiran Mahasiswa', { align: 'center' }).moveDown();
  data.forEach((a, i) => {
    doc.fontSize(12).text(`${i + 1}. ${a.user.username} - ${a.status}`);
  });
  doc.end();
};