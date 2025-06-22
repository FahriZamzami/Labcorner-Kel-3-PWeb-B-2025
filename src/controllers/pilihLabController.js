const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pilihLabController = {
  // Menampilkan halaman Pilih Lab
  async getDaftarLab(req, res) {
    try {
      const daftarLab = await prisma.praktikum.findMany({
        select: {
          id: true,
          nama_praktikum: true,
          lab_id: true,
          // kode_masuk: true // Tidak perlu mengambil kode_masuk di sini
        },
        orderBy: {
          nama_praktikum: 'asc'
        }
      });

      // Menambahkan pesan error dari session jika ada
      const errorMessage = req.session.errorMessage;
      delete req.session.errorMessage; // Hapus pesan setelah digunakan

      res.render('pilihLab', { daftarLab, error: errorMessage });
    } catch (error) {
      console.error('Error fetching lab data:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil data lab.');
    }
  },

  // Menampilkan halaman input kode akses
  async getEnterCode(req, res) {
    const labId = parseInt(req.params.labId);

    if (isNaN(labId)) {
      // Jika labId tidak valid, redirect kembali atau tampilkan error
      req.session.errorMessage = 'ID praktikum tidak valid.';
      return res.redirect('/pilihLab');
    }

    try {
      const praktikum = await prisma.praktikum.findUnique({
        where: { id: labId },
        select: { id: true, nama_praktikum: true } // Hanya ambil id dan nama_praktikum
      });

      if (!praktikum) {
        req.session.errorMessage = 'Praktikum tidak ditemukan.';
        return res.redirect('/pilihLab');
      }

      // Ambil pesan error spesifik untuk halaman ini jika ada
      const errorMessage = req.session.errorMessage;
      delete req.session.errorMessage;

      res.render('enterLabCode', { praktikum, error: errorMessage }); // Render halaman baru
    } catch (error) {
      console.error('Error fetching specific lab data for code entry:', error);
      req.session.errorMessage = 'Terjadi kesalahan saat mengambil detail praktikum.';
      res.redirect('/pilihLab');
    }
  },

  // Memproses kode akses lab
  async joinLab(req, res) {
    const { labCode, labId } = req.body;

    try {
      const praktikum = await prisma.praktikum.findFirst({
        where: {
          id: parseInt(labId),
          kode_masuk: labCode
        },
      });

      if (praktikum) {
        req.session.currentLab = {
          id: praktikum.id,
          nama_praktikum: praktikum.nama_praktikum,
          lab_id: praktikum.lab_id
        };
        res.redirect('/home');
      } else {
        // Jika kode tidak valid, simpan pesan error di session dan redirect kembali ke halaman input kode akses
        req.session.errorMessage = 'Kode akses tidak valid. Silakan coba lagi.';
        res.redirect(`/pilihLab/enterCode/${labId}`); // Redirect kembali ke halaman input kode akses spesifik
      }
    } catch (error) {
      console.error('Error verifying lab code:', error);
      req.session.errorMessage = 'Terjadi kesalahan saat memverifikasi kode akses.';
      res.redirect(`/pilihLab/enterCode/${labId}`); // Redirect kembali ke halaman input kode akses spesifik
    }
  }
};

module.exports = pilihLabController; 