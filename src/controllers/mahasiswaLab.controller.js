const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDaftarLab = async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany();
    res.render('mahasiswa/laboratorium', { jadwal });
  } catch (err) {
    console.error('❌ Gagal ambil daftar lab:', err);
    res.status(500).send('Gagal load lab');
  }
};

const getDetailLab = async (req, res) => {
  const jadwalId = parseInt(req.params.id);
  const userId = req.session.user?.id;

  try {
    const absensi = await prisma.absensi.findMany({
      where: { userId, jadwalId }
    });

    const count = {
      hadir: absensi.filter(a => a.status === 'Hadir').length,
      izin: absensi.filter(a => a.status === 'Izin').length,
      sakit: absensi.filter(a => a.status === 'Sakit').length,
      alfa: absensi.filter(a => a.status === 'Tidak Hadir').length
    };

    const nilai = await prisma.nilai.findMany({
      where: { userId, jadwalId }
    });

    const lab = await prisma.jadwal.findUnique({
      where: { id: jadwalId }
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

module.exports = {
  getDaftarLab,
  getDetailLab
};