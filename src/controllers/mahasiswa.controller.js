const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMahasiswaBySemester = async (req, res) => {
  const { semester } = req.query;

  try {
    if (!semester) {
      return res.render('mahasiswa', { mahasiswa: [] });
    }

    const absensiData = await prisma.absensi.findMany({
      where: {
        jadwal: {
          semester: semester,
        },
        user: {
          peran: 'mahasiswa',
        },
      },
      include: {
        user: true,
        jadwal: true,
      },
    });

    const mahasiswa = absensiData.map((absen) => ({
      id: absen.id,
      nama: absen.user.username,
      status: absen.status,
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (error) {
    console.error('❌ Gagal ambil data mahasiswa:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

exports.searchMahasiswa = async (req, res) => {
  const q = req.query.q || '';

  try {
    const result = await prisma.user.findMany({
      where: {
        peran: 'mahasiswa',
        username: {
          contains: q,
          mode: 'insensitive',
        },
      },
    });

    const mahasiswa = result.map((mhs) => ({
      id: mhs.id,
      nama: mhs.username,
      status: '-', // Kosong karena tidak ambil absensi
    }));

    res.render('mahasiswa', { mahasiswa });
  } catch (error) {
    console.error('❌ Gagal cari mahasiswa:', error);
    res.render('mahasiswa', { mahasiswa: [] });
  }
};

exports.updateStatusMahasiswa = async (req, res) => {
  const absensiId = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await prisma.absensi.update({
      where: { id: absensiId },
      data: { status },
    });

    res.redirect('back');
  } catch (error) {
    console.error('❌ Gagal update status:', error);
    res.status(500).send('Gagal update status mahasiswa.');
  }
};