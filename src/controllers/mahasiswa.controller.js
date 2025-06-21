const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDaftarMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await prisma.user.findMany({
      where: { peran: 'mahasiswa' },
      include: { absensi: true },
    });

    const data = mahasiswa.map((mhs) => {
      const hadir = mhs.absensi.filter(a => a.status === 'Hadir').length;
      const tidakHadir = mhs.absensi.filter(a => a.status === 'Tidak_Hadir').length;

      return {
        nama: mhs.username,
        hadir,
        tidakHadir
      };
    });

    res.render('daftarmahasiswa', { data });
  } catch (error) {
    console.error('❌ Gagal mengambil data:', error);
    res.status(500).send('Gagal mengambil data mahasiswa');
  }
};

// Pastikan semua fungsi diekspor di sini
module.exports = {getDaftarMahasiswa};