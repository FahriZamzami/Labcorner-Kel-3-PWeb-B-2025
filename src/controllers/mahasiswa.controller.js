const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🟣 Halaman Rekap Kehadiran Mahasiswa
const getDaftarMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await prisma.user.findMany({
      where: { peran: 'mahasiswa' },
      include: { absensi: true }
    });

    const data = mahasiswa.map((mhs) => {
      const hadir = mhs.absensi.filter(a => a.status === 'Hadir').length;
      const tidakHadir = mhs.absensi.filter(a => a.status === 'Tidak_Hadir').length;
      return { nama: mhs.username, hadir, tidakHadir };
    });

    res.render('daftarmahasiswa', { data, keyword: '', sort: 'desc' });
  } catch (error) {
    console.error('❌ Gagal ambil data:', error);
    res.status(500).send('Gagal memuat data');
  }
};

// 🔍 Pencarian pada halaman rekap
const searchMahasiswaRekap = async (req, res) => {
  const keyword = req.query.q || '';
  const sort = req.query.sort || 'desc';

  try {
    const result = await prisma.user.findMany({
      where: {
        peran: 'mahasiswa',
        username: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      include: { absensi: true }
    });

    let data = result.map((mhs) => {
      const hadir = mhs.absensi.filter(a => a.status === 'Hadir').length;
      const tidakHadir = mhs.absensi.filter(a => a.status === 'Tidak_Hadir').length;
      return { nama: mhs.username, hadir, tidakHadir };
    });

    data.sort((a, b) => sort === 'asc' ? a.hadir - b.hadir : b.hadir - a.hadir);

    res.render('daftarmahasiswa', { data, keyword, sort });
  } catch (error) {
    console.error('❌ Gagal cari rekap:', error);
    res.status(500).send('Error');
  }
};

// 🔄 Input/update status (asisten lab)
const searchMahasiswa = async (req, res) => {
  const keyword = req.query.q || '';

  try {
    const semester = req.query.semester;
    
const result = await prisma.user.findMany({
  where: {
    peran: 'mahasiswa',
    username: {
      contains: keyword,
      mode: 'insensitive'
    },
    absensi: {
      some: {
        jadwal: {
          semester: semester ? semester : undefined
        }
      }
    }
  },
  include: { absensi: { include: { jadwal: true } } }
});

    const mahasiswa = result.map((mhs) => ({
      id: mhs.id,
      nama: mhs.username,
      status: '-' // placeholder
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (error) {
    console.error('❌ Gagal cari mahasiswa:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

const getMahasiswaBySemester = async (req, res) => {
  const { semester } = req.query;

  try {
    const absensiData = await prisma.absensi.findMany({
      where: {
        jadwal: { semester },
        user: { peran: 'mahasiswa' }
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
    console.error('❌ Filter semester gagal:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

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
    console.error('❌ Update status gagal:', error);
    res.status(500).send('Gagal update status');
  }
};

module.exports = {
  getDaftarMahasiswa,
  searchMahasiswa,
  getMahasiswaBySemester,
  updateStatusMahasiswa,
  searchMahasiswaRekap
};