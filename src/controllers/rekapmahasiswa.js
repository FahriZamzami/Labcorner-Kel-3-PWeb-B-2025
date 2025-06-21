exports.rekapMahasiswa = async (req, res) => {
  try {
    const result = await prisma.absensi.groupBy({
      by: ['user_id', 'status'],
      _count: true,
    });

    const users = await prisma.user.findMany({
      where: { peran: 'mahasiswa' },
      select: { id: true, username: true },
    });

    const dataMap = {};

    result.forEach(entry => {
      const uid = entry.user_id;
      if (!dataMap[uid]) {
        const user = users.find(u => u.id === uid);
        dataMap[uid] = {
          nama: user?.username || 'Tidak Dikenal',
          Hadir: 0,
          Tidak_Hadir: 0
        };
      }

      if (entry.status === 'Hadir') {
        dataMap[uid].Hadir = entry._count;
      } else {
        dataMap[uid].Tidak_Hadir += entry._count;
      }
    });

    const data = Object.values(dataMap);
    res.render('daftarMahasiswa', { data });
  } catch (err) {
    console.error('❌ Gagal rekap:', err);
    res.render('daftarMahasiswa', { data: [] });
  }
};