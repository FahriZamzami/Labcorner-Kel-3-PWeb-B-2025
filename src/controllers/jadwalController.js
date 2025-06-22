const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jadwalController = {
  // Menampilkan jadwal praktikum
  async getJadwal(req, res) {
    try {
      const currentLab = req.session.currentLab;
      if (!currentLab) {
        return res.redirect('/pilihLab');
      }

      const daftarJadwal = await prisma.jadwal.findMany({
        where: {
          praktikum_id: currentLab.id
        },
        select: {
          id: true,
          tanggal: true,
          jam: true,
          ruangan: true,
          nama_pengajar: true,
          dibuat_pada: true,
          user: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          tanggal: 'asc'
        }
      });

      // Format tanggal dan jam untuk tampilan
      const jadwalFormatted = daftarJadwal.map((jadwal, index) => ({
        ...jadwal,
        pertemuan: `Pertemuan ${index + 1}`,
        tanggal_formatted: jadwal.tanggal.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        jam_formatted: jadwal.jam.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        dibuat_pada_formatted: jadwal.dibuat_pada ? jadwal.dibuat_pada.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : '-'
      }));

      res.render('jadwal', {
        currentPage: 'jadwal',
        currentLab: currentLab,
        daftarJadwal: jadwalFormatted
      });

    } catch (error) {
      console.error('Error fetching jadwal:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil jadwal praktikum.');
    }
  }
};

module.exports = jadwalController; 