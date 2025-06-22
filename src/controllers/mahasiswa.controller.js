const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🟣 Halaman Rekap Kehadiran Mahasiswa (semua data)
const getDaftarMahasiswa = async (req, res) => {
  try {
    const mahasiswaData = await prisma.user.findMany({
      where: { peran: 'mahasiswa' },
      include: { absensi: true }
    });

    const data = mahasiswaData.map((mhs) => {
      const hadir = mhs.absensi.filter(a => a.status === 'Hadir').length;
      const tidakHadir = mhs.absensi.filter(a => a.status === 'Tidak_Hadir').length;
      return { nama: mhs.username, hadir, tidakHadir };
    });

    const allJadwal = await prisma.jadwal.findMany({
      select: { semester: true },
      distinct: ['semester']
    });
    const semesters = allJadwal.map(j => j.semester).filter(s => s);

    res.render('daftarmahasiswa', { 
      data, 
      keyword: '', 
      semesters,
      selectedSemester: 'all'
    });
  } catch (error) {
    console.error('❌ Gagal ambil data:', error);
    res.render('daftarmahasiswa', { 
      data: [], 
      keyword: '', 
      semesters: [],
      selectedSemester: 'all'
    });
  }
};

// 🔍 Pencarian rekap kehadiran + sort berdasarkan jumlah hadir
const searchMahasiswaRekap = async (req, res) => {
  const keyword = req.query.q || '';
  const semester = req.query.semester || 'all';

  try {
    let whereClause = {
      peran: 'mahasiswa',
      username: {
        contains: keyword,
        mode: 'insensitive'
      }
    };

    if (semester && semester !== 'all') {
      whereClause.absensi = {
        some: {
          jadwal: {
            semester: semester
          }
        }
      };
    }

    const result = await prisma.user.findMany({
      where: whereClause,
      include: { absensi: true }
    });

    const data = result.map((mhs) => {
      const hadir = mhs.absensi.filter(a => a.status === 'Hadir').length;
      const tidakHadir = mhs.absensi.filter(a => a.status === 'Tidak_Hadir').length;
      return {
        nama: mhs.username,
        hadir,
        tidakHadir
      };
    });

    const allJadwal = await prisma.jadwal.findMany({
      select: { semester: true },
      distinct: ['semester']
    });
    const semesters = allJadwal.map(j => j.semester).filter(s => s);

    res.render('daftarmahasiswa', { 
      data, 
      keyword, 
      semesters,
      selectedSemester: semester
    });
  } catch (error) {
    console.error('❌ Gagal cari rekap:', error);
    res.render('daftarmahasiswa', {
      data: [],
      keyword,
      semesters: [],
      selectedSemester: semester
    });
  }
};

// 🔎 Pencarian mahasiswa berdasarkan nama dan semester
const searchMahasiswa = async (req, res) => {
  const keyword = req.query.q || '';
  const semester = req.query.semester;

  try {
    let whereClause = {
      peran: 'mahasiswa',
      username: {
        contains: keyword,
        mode: 'insensitive'
      }
    };

    // Jika ada semester, kita cari berdasarkan jadwal yang terkait
    if (semester && semester !== 'all') {
      whereClause.absensi = {
        some: {
          jadwal: {
            semester: semester
          }
        }
      };
    }

    const result = await prisma.user.findMany({
      where: whereClause,
      include: {
        absensi: {
          include: { jadwal: true }
        }
      }
    });

    const mahasiswa = result.map((mhs) => ({
      id: mhs.id,
      nama: mhs.username,
      status: '-' // placeholder, nanti bisa diisi status terakhir misalnya
    }));

    // Ambil daftar semester untuk dropdown
    const allJadwal = await prisma.jadwal.findMany({
      select: { semester: true },
      distinct: ['semester']
    });
    const semesters = allJadwal.map(j => j.semester).filter(s => s);

    res.render('mahasiswa', { mahasiswa, semesters, selectedSemester: semester });
  } catch (error) {
    console.error('❌ Gagal cari mahasiswa:', error);
    res.render('mahasiswa', { mahasiswa: [], semesters: [], selectedSemester: '' });
  }
};

// 🎓 Ambil data absensi berdasarkan semester
const getMahasiswaBySemester = async (req, res) => {
  const { semester } = req.query;

  try {
    // Karena tidak ada field semester di jadwal, kita ambil semua absensi mahasiswa
    const absensiData = await prisma.absensi.findMany({
      where: {
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

// 🔁 Update status absensi mahasiswa
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