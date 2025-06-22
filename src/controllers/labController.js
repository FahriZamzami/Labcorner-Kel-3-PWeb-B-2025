// src/controllers/labController.js

const prisma = require('../lib/prisma');

// Menampilkan halaman detail lab berdasarkan ID
exports.getLabDetail = async (req, res) => {
  try {
    const labId = req.params.id; // Cth: 'lea'
    const labData = await prisma.lab.findUnique({
      where: { id: labId },
      include: {
        users: { // Ambil semua user yang terhubung dengan lab ini
          select: { fullName: true, role: true } 
        },
      },
    });

    if (!labData) {
      return res.status(404).send('Lab tidak ditemukan');
    }

    // Pisahkan user berdasarkan peran
    const asisten = labData.users.filter(u => u.role === 'Asisten').map(u => u.fullName);
    const mahasiswa = labData.users.filter(u => u.role === 'Mahasiswa').map(u => u.fullName);

    // Siapkan data lengkap untuk view
    const viewData = {
      ...labData,
      jumlahAsisten: asisten.length,
      jumlahMahasiswa: mahasiswa.length,
      asisten: asisten,
      mahasiswa: mahasiswa,
      // Data dummy untuk yang tidak ada di model
      jumlahModul: 8 + Math.floor(Math.random() * 5),
      jumlahKelas: 3 + Math.floor(Math.random() * 5),
    };
    
    res.render('detail-lab', {
      title: `Detail ${labData.nama}`,
      lab: viewData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi error di server');
  }
};