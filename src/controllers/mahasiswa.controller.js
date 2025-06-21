const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /mahasiswa/rekap
 */
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

/**
 * GET /mahasiswa?q=
 */
const searchMahasiswa = async (req, res) => {
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

    const mahasiswa = result.map((mhs) => ({
      id: mhs.id,
      nama: mhs.username,
      status: '-' // Default jika belum ada absensi
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (error) {
    console.error('❌ Gagal mencari mahasiswa:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

/**
 * GET /filter-semester?semester=...
 */
const getMahasiswaBySemester = async (req, res) => {
  const { semester } = req.query;

  try {
    if (!semester) return res.render('mahasiswa', { mahasiswa: [] });

    const absensiData = await prisma.absensi.findMany({
      where: {
        jadwal: {
          semester: semester
        },
        user: {
          peran: 'mahasiswa'
        }
      },
      include: { user: true }
    });

    const mahasiswa = absensiData.map(absen => ({
      id: absen.id,
      nama: absen.user.username,
      status: absen.status
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (error) {
    console.error('❌ Gagal filter semester:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

/**
 * POST /update-status/:id
 */
const updateStatusMahasiswa = async (req, res) => {
  const absensiId = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await prisma.absensi.update({
      where: { id: absensiId },
      data: { status }
    });

    res.redirect('back');
  } catch (error) {
    console.error('❌ Gagal update status:', error);
    res.status(500).send('Update status gagal');
  }
};

module.exports = {
  getDaftarMahasiswa,
  searchMahasiswa,
  getMahasiswaBySemester,
  updateStatusMahasiswa
};