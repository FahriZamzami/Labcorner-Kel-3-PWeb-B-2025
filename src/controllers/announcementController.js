// src/controllers/announcementController.js

const prisma = require('../lib/prisma');

// Menampilkan halaman untuk membuat pengumuman
exports.getCreateAnnouncementPage = async (req, res) => {
  try {
    // Ambil daftar lab untuk ditampilkan di dropdown
    const labs = await prisma.lab.findMany();
    res.render('buat-pengumuman', {
      title: 'Buat Pengumuman Baru',
      labs: labs
    });
  } catch (error) {
      console.error(error);
      res.status(500).send('Gagal mengambil data lab');
  }
};

// Memproses data dari form pengumuman dan menyimpannya
exports.createAnnouncement = async (req, res) => {
  const { judul, isi, lab_tujuan } = req.body;
  try {
    await prisma.announcement.create({
      data: {
        judul,
        isi,
        labId: lab_tujuan, // 'lab_tujuan' dari form adalah ID lab
      },
    });
    res.status(201).json({ message: 'Pengumuman berhasil dipublikasikan' });
  } catch (error) {
    console.error("Gagal membuat pengumuman:", error);
    res.status(500).json({ message: 'Gagal mempublikasikan pengumuman' });
  }
};