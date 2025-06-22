// src/controllers/mainController.js

const prisma = require('../lib/prisma');

// Menampilkan halaman dasbor utama
exports.getDashboard = async (req, res) => {
  try {
    // Ambil semua data lab, dan hitung jumlah user (asisten/mahasiswa) di setiap lab
    const labs = await prisma.lab.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    // Anda bisa menambahkan logika untuk menghitung statistik laporan di sini
    // Untuk saat ini, kita gunakan data dummy untuk persentase
    const labDataForView = labs.map(lab => ({
      ...lab,
      laporan: 75 + Math.floor(Math.random() * 25), // Contoh persentase acak
    }));

    res.render('dashboard', {
      title: 'Dashboard Utama',
      labs: labDataForView,
    });
  } catch (error) {
    console.error("Gagal mengambil data dasbor:", error);
    res.status(500).send('Terjadi error di server');
  }
};