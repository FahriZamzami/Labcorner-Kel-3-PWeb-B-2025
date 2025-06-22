const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

const modulMateriController = {
  // Menampilkan halaman Modul Materi
  async getModulMateri(req, res) {
    try {
      const currentLab = req.session.currentLab;
      console.log('currentLab:', currentLab);
      
      // Jika tidak ada currentLab, redirect ke dashboard-kelas
      if (!currentLab) {
        console.log('No currentLab in session, redirecting to dashboard-kelas');
        return res.redirect('/dashboard-kelas');
      }

      const praktikumId = currentLab.id;
      console.log('Using praktikum ID:', praktikumId);

      // Fetch modul data from database
      const moduls = await prisma.modul.findMany({
        where: {
          praktikum_id: praktikumId
        },
        include: {
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

      console.log('Moduls found:', moduls.length);

      // Get total download count - handle case where downloadTracking table might not exist yet
      let totalDownloads = 0;
      try {
        // Count unique moduls that have been downloaded
        const uniqueDownloadedModuls = await prisma.downloadTracking.groupBy({
          by: ['modul_id'],
          where: {
            praktikum_id: praktikumId
          }
        });
        totalDownloads = uniqueDownloadedModuls.length;
        console.log('Unique downloaded moduls:', uniqueDownloadedModuls);
        console.log('Total downloads (unique):', totalDownloads);
      } catch (downloadError) {
        console.log('Download tracking table might not exist yet, setting totalDownloads to 0');
        console.log('Error details:', downloadError.message);
        totalDownloads = 0;
      }

      // Get praktikum info for display with lab data
      const praktikum = await prisma.praktikum.findUnique({
        where: { id: praktikumId },
        include: {
          lab: true
        }
      });

      // Update currentLab with complete data
      const updatedCurrentLab = {
        ...currentLab,
        lab: praktikum.lab
      };

      res.render('modulMateri', { 
        currentPage: 'modulMateri',
        currentLab: updatedCurrentLab,
        moduls: moduls,
        totalDownloads: totalDownloads
      });
    } catch (error) {
      console.error('Error fetching modul data:', error);
      res.status(500).json({ 
        error: 'Terjadi kesalahan saat mengambil data modul', 
        detail: error.message 
      });
    }
  },

  // Download modul file
  async downloadModul(req, res) {
    try {
      const { modulId } = req.params;
      const currentLab = req.session.currentLab;
      const userId = req.session.userId || 'dummy-user-id';

      // Jika tidak ada currentLab, coba ambil praktikum pertama
      let praktikumId = null;
      if (!currentLab) {
        const firstPraktikum = await prisma.praktikum.findFirst();
        if (firstPraktikum) {
          praktikumId = firstPraktikum.id;
        } else {
          return res.status(400).json({ error: 'Tidak ada praktikum yang tersedia' });
        }
      } else {
        praktikumId = currentLab.id;
      }

      // Get modul data
      const modul = await prisma.modul.findFirst({
        where: {
          id: parseInt(modulId),
          praktikum_id: praktikumId
        }
      });

      if (!modul) {
        return res.status(404).json({ error: 'Modul tidak ditemukan' });
      }

      // Check if file exists
      const filePath = path.join(__dirname, '../../public/modul', modul.file_path);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File modul tidak ditemukan' });
      }

      // Record download tracking
      try {
        await prisma.downloadTracking.create({
          data: {
            modul_id: modul.id,
            user_id: userId,
            praktikum_id: praktikumId,
            downloaded_at: new Date()
          }
        });
      } catch (trackingError) {
        console.log('Could not record download tracking:', trackingError.message);
        // Continue with download even if tracking fails
      }

      // Send file for download
      res.download(filePath, modul.file_path, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Terjadi kesalahan saat mengunduh file' });
        }
      });

    } catch (error) {
      console.error('Error downloading modul:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengunduh modul' });
    }
  },

  // Get download statistics
  async getDownloadStats(req, res) {
    try {
      const currentLab = req.session.currentLab;
      let praktikumId = null;
      
      if (!currentLab) {
        const firstPraktikum = await prisma.praktikum.findFirst();
        if (firstPraktikum) {
          praktikumId = firstPraktikum.id;
        } else {
          return res.status(400).json({ error: 'Tidak ada praktikum yang tersedia' });
        }
      } else {
        praktikumId = currentLab.id;
      }

      let totalDownloads = 0;
      let downloadsByModul = [];

      try {
        // Count unique moduls that have been downloaded
        const uniqueDownloadedModuls = await prisma.downloadTracking.groupBy({
          by: ['modul_id'],
          where: {
            praktikum_id: praktikumId
          }
        });
        totalDownloads = uniqueDownloadedModuls.length;

        downloadsByModul = await prisma.downloadTracking.groupBy({
          by: ['modul_id'],
          where: {
            praktikum_id: praktikumId
          },
          _count: {
            id: true
          }
        });
      } catch (statsError) {
        console.log('Download tracking not available:', statsError.message);
      }

      res.json({
        totalDownloads,
        downloadsByModul
      });

    } catch (error) {
      console.error('Error getting download stats:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil statistik download' });
    }
  }
};

module.exports = modulMateriController; 