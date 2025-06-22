const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDaftarLab = async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany({
      include: {
        praktikum: true
      }
    });
    
    console.log('Jadwal found:', jadwal.length);
    res.render('mahasiswa/laboratorium', { jadwal, user: req.session.user });
  } catch (err) {
    console.error('❌ Gagal ambil daftar lab:', err);
    // Render dengan array kosong jika ada error
    res.render('mahasiswa/laboratorium', { jadwal: [] });
  }
};

const getDetailLab = async (req, res) => {
  const jadwalId = parseInt(req.params.id);
  const userId = req.session.user?.id;

  try {
    const absensi = await prisma.absensi.findMany({
      where: { user_id: userId, jadwal_id: jadwalId }
    });

    const count = {
      hadir: absensi.filter(a => a.status === 'Hadir').length,
      izin: 0, // Tidak ada status Izin dalam enum
      sakit: 0, // Tidak ada status Sakit dalam enum
      alfa: absensi.filter(a => a.status === 'Tidak_Hadir').length
    };

    // Karena tidak ada model nilai, kita buat array kosong
    const nilai = [];

    const lab = await prisma.jadwal.findUnique({
      where: { id: jadwalId },
      include: {
        praktikum: true
      }
    });

    res.render('mahasiswa/rekap', {
      absensi: count,
      nilai,
      lab
    });
  } catch (err) {
    console.error('❌ Gagal tampilkan rekap:', err);
    res.status(500).send('Gagal load data rekapan');
  }
};

// Rekap Absensi Mahasiswa
const getRekapAbsensi = async (req, res) => {
  const userId = req.session.user?.id;

  try {
    const absensiData = await prisma.absensi.findMany({
      where: { user_id: userId },
      include: {
        jadwal: {
          include: {
            praktikum: true
          }
        }
      }
    });

    const rekapAbsensi = absensiData.map(absen => ({
      praktikum: absen.jadwal.praktikum.nama_praktikum,
      tanggal: absen.jadwal.tanggal,
      status: absen.status
    }));

    res.render('mahasiswa/rekap-absensi', { 
      rekapAbsensi, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('❌ Gagal ambil rekap absensi:', err);
    res.render('mahasiswa/rekap-absensi', { 
      rekapAbsensi: [], 
      user: req.session.user 
    });
  }
};

// Rekap Nilai Mahasiswa
const getRekapNilai = async (req, res) => {
  const userId = req.session.user?.id;

  try {
    // Get nilai data from database for the logged-in user
    const nilaiData = await prisma.nilai.findMany({
      where: { user_id: userId },
      include: {
        jadwal: {
          include: {
            praktikum: true
          }
        }
      }
    });

    // Group by praktikum and calculate averages
    const groupedNilai = {};
    nilaiData.forEach(nilai => {
      const praktikum = nilai.jadwal.praktikum.nama_praktikum;
      if (!groupedNilai[praktikum]) {
        groupedNilai[praktikum] = {
          praktikum: praktikum,
          kuis: [],
          instruksi: [],
          responsi: []
        };
      }
      
      // Group by jenis nilai
      if (nilai.jenis.toLowerCase() === 'kuis') {
        groupedNilai[praktikum].kuis.push(nilai.skor);
      } else if (nilai.jenis.toLowerCase() === 'instruksi') {
        groupedNilai[praktikum].instruksi.push(nilai.skor);
      } else if (nilai.jenis.toLowerCase() === 'responsi') {
        groupedNilai[praktikum].responsi.push(nilai.skor);
      }
    });

    // Calculate averages and format data
    const rekapNilai = Object.values(groupedNilai).map(kelas => {
      const avgKuis = kelas.kuis.length > 0 ? (kelas.kuis.reduce((a, b) => a + b, 0) / kelas.kuis.length).toFixed(1) : 0;
      const avgInstruksi = kelas.instruksi.length > 0 ? (kelas.instruksi.reduce((a, b) => a + b, 0) / kelas.instruksi.length).toFixed(1) : 0;
      const avgResponsi = kelas.responsi.length > 0 ? (kelas.responsi.reduce((a, b) => a + b, 0) / kelas.responsi.length).toFixed(1) : 0;

      return {
        praktikum: kelas.praktikum,
        nilai: [
          { jenis: 'Kuis', skor: parseFloat(avgKuis) },
          { jenis: 'Instruksi', skor: parseFloat(avgInstruksi) },
          { jenis: 'Responsi', skor: parseFloat(avgResponsi) }
        ]
      };
    });

    res.render('mahasiswa/rekap-nilai', { 
      rekapNilai, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('❌ Gagal ambil rekap nilai:', err);
    res.render('mahasiswa/rekap-nilai', { 
      rekapNilai: [], 
      user: req.session.user 
    });
  }
};

module.exports = {
  getDaftarLab,
  getDetailLab,
  getRekapAbsensi,
  getRekapNilai
};