const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dashboardController = {
  // Menampilkan dashboard dengan statistik praktikum
  async getDashboard(req, res) {
    try {
      const currentLab = req.session.currentLab;
      if (!currentLab) {
        return res.redirect('/pilihLab');
      }

      // Ambil data statistik untuk praktikum yang sedang aktif
      const praktikumId = currentLab.id;

      // Hitung jumlah mahasiswa yang terdaftar
      const jumlahMahasiswa = await prisma.pendaftaran.count({
        where: {
          praktikum_id: praktikumId
        }
      });

      // Hitung jumlah modul
      const jumlahModul = await prisma.modul.count({
        where: {
          praktikum_id: praktikumId
        }
      });

      // Hitung jumlah asisten aktif berdasarkan nama_pengajar di jadwal
      const jumlahAsistenAktif = await prisma.jadwal.groupBy({
        by: ['nama_pengajar'],
        where: {
          praktikum_id: praktikumId,
          nama_pengajar: {
            not: null
          }
        }
      });

      // Ambil data modul untuk ditampilkan
      const daftarModul = await prisma.modul.findMany({
        where: {
          praktikum_id: praktikumId
        },
        select: {
          id: true,
          judul: true,
          diunggah_pada: true,
          user: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          diunggah_pada: 'desc'
        },
        take: 5 // Ambil 5 modul terbaru
      });

      // Ambil data mahasiswa untuk ditampilkan
      const daftarMahasiswa = await prisma.pendaftaran.findMany({
        where: {
          praktikum_id: praktikumId
        },
        select: {
          id: true,
          waktu_daftar: true,
          user: {
            select: {
              id: true,
              username: true,
              peran: true
            }
          }
        },
        orderBy: {
          waktu_daftar: 'desc'
        },
        take: 10 // Ambil 10 mahasiswa terbaru
      });

      res.render('dashboard', {
        currentPage: 'dashboard',
        currentLab,
        jumlahMahasiswa,
        jumlahModul,
        jumlahAsistenAktif: jumlahAsistenAktif.length,
        daftarModul,
        daftarMahasiswa
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil data dashboard.');
    }
  },

  // Menampilkan daftar modul lengkap
  async getDaftarModul(req, res) {
    try {
      const currentLab = req.session.currentLab;
      if (!currentLab) {
        return res.redirect('/pilihLab');
      }

      const daftarModul = await prisma.modul.findMany({
        where: {
          praktikum_id: currentLab.id
        },
        select: {
          id: true,
          judul: true,
          diunggah_pada: true,
          user: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          diunggah_pada: 'desc'
        }
      });

      res.render('daftarModul', {
        currentPage: 'modulMateri',
        currentLab,
        daftarModul
      });

    } catch (error) {
      console.error('Error fetching modul list:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil daftar modul.');
    }
  },

  // Menampilkan daftar mahasiswa
  async getDaftarMahasiswa(req, res) {
    try {
      const currentLab = req.session.currentLab;
      if (!currentLab) {
        return res.redirect('/pilihLab');
      }

      const daftarMahasiswa = await prisma.pendaftaran.findMany({
        where: {
          praktikum_id: currentLab.id
        },
        select: {
          id: true,
          waktu_daftar: true,
          user: {
            select: {
              id: true,
              username: true,
              peran: true,
              dibuat_pada: true
            }
          }
        },
        orderBy: {
          waktu_daftar: 'desc'
        }
      });

      res.render('daftarMahasiswa', {
        currentPage: 'mahasiswa',
        currentLab,
        daftarMahasiswa
      });

    } catch (error) {
      console.error('Error fetching student list:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil daftar mahasiswa.');
    }
  }
};

module.exports = dashboardController; 