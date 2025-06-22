const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const homeController = {
  // Halaman utama setelah bergabung dengan lab
  async getHome(req, res) {
    try {
      const currentLab = req.session.currentLab;
      
      if (!currentLab) {
        return res.redirect('/dashboard-kelas');
      }

      // Ambil data lengkap praktikum dari database
      const praktikumData = await prisma.praktikum.findUnique({
        where: {
          id: currentLab.id
        },
        include: {
          lab: true
        }
      });

      if (!praktikumData) {
        // Jika praktikum tidak ditemukan, hapus session dan redirect
        delete req.session.currentLab;
        return res.redirect('/dashboard-kelas');
      }

      // Update session dengan data lengkap
      req.session.currentLab = {
        id: praktikumData.id,
        nama_praktikum: praktikumData.nama_praktikum,
        lab_id: praktikumData.lab_id,
        lab: praktikumData.lab
      };

      res.render('home', { 
        currentLab: req.session.currentLab, 
        currentPage: 'home' 
      });

    } catch (error) {
      console.error('Error in home controller:', error);
      res.status(500).send('Terjadi kesalahan saat memuat halaman home.');
    }
  }
};

module.exports = homeController; 