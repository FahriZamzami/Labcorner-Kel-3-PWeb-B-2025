const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Tentukan ROOT_PROJECT_DIR sekali di awal
const ROOT_PROJECT_DIR = path.join(__dirname, '..', '..');

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(ROOT_PROJECT_DIR, 'public', 'uploads');
    console.log('[Multer] Upload directory:', uploadDir);

    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`[Multer] Direktori 'uploads' dibuat: ${uploadDir}`);
      } catch (mkdirError) {
        console.error(`[Multer ERROR] Gagal membuat direktori 'uploads':`, mkdirError);
        return cb(new Error('Gagal membuat direktori unggahan.'), false);
      }
    } else {
      console.log(`[Multer] Direktori 'uploads' sudah ada: ${uploadDir}`);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_\.]/g, '_');
    const filename = `${safeBaseName}-${uniqueSuffix}${fileExtension}`;
    
    console.log('[Multer] Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|zip|rar|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Jenis file tidak diizinkan! Hanya PDF, DOC, DOCX, ZIP, RAR, JPG, JPEG, PNG.'), false);
    }
  }
});

// Controller methods
const tugasController = {
  // Menampilkan daftar tugas
  async getDaftarTugas(req, res) {
    try {
      const currentLab = req.session.currentLab;
      if (!currentLab) {
        return res.redirect('/pilihLab');
      }
      
      const daftarTugas = await prisma.tugas.findMany({
        orderBy: { batas_waktu: 'asc' }
      });

      const formattedTugas = daftarTugas.map(tugas => ({
        ...tugas,
        batas_waktu_formatted: tugas.batas_waktu.toLocaleString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
        }) + ' WIB'
      }));

      res.render('tugas', { 
        daftarTugas: formattedTugas, 
        currentPage: 'tugas',
        currentLab: currentLab
      });
    } catch (error) {
      console.error('[GET /] Error fetching tasks:', error);
      res.status(500).send('Terjadi kesalahan saat mengambil daftar tugas.');
    }
  },

  // Menampilkan detail tugas
  async getDetailTugas(req, res) {
    const tugasId = parseInt(req.params.id);
    const userId = req.session.user ? req.session.user.id : req.user.id;
    const currentLab = req.session.currentLab;

    if (!currentLab) {
      return res.redirect('/pilihLab');
    }

    if (isNaN(tugasId)) {
      return res.status(400).send('ID tugas tidak valid.');
    }

    try {
      const tugasDetail = await prisma.tugas.findUnique({
        where: { id: tugasId },
        include: { pengumpulan: { where: { user_id: userId } } }
      });

      if (tugasDetail) {
        tugasDetail.batas_waktu_formatted = tugasDetail.batas_waktu.toLocaleString('id-ID', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
        }) + ' WIB';
        const submittedFile = tugasDetail.pengumpulan.length > 0 ? tugasDetail.pengumpulan[0] : null;
        res.render('detailTugas', { 
          tugas: tugasDetail, 
          submittedFile: submittedFile, 
          currentPage: 'tugas',
          currentLab: currentLab
        });
      } else {
        res.status(404).send('Tugas tidak ditemukan');
      }
    } catch (error) {
      console.error(`[GET /:id] Error fetching task detail for ID ${tugasId}:`, error);
      res.status(500).send('Terjadi kesalahan saat mengambil detail tugas.');
    }
  },

  // Upload file tugas
  uploadFile: (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('[POST /:id/upload] Multer error:', err);
        return res.status(400).json({ 
          message: err.message || 'Error saat upload file',
          error: err.toString()
        });
      }
      
      // Lanjutkan ke handler utama
      tugasController.handleUpload(req, res);
    });
  },

  async handleUpload(req, res) {
    console.log('[POST /:id/upload] Request received');
    console.log('[POST /:id/upload] File:', req.file);
    console.log('[POST /:id/upload] Body:', req.body);
    
    const tugasId = parseInt(req.params.id);
    const userId = req.session.user ? req.session.user.id : req.user.id;
    
    console.log('[POST /:id/upload] Tugas ID:', tugasId);
    console.log('[POST /:id/upload] User ID:', userId);

    if (req.fileValidationError) {
        console.error('[POST /:id/upload] Multer File Validation Error:', req.fileValidationError);
        return res.status(400).json({ message: req.fileValidationError });
    }

    if (isNaN(tugasId)) {
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.log(`[POST /:id/upload] File sementara dihapus karena ID tugas tidak valid: ${req.file.path}`);
        } catch (unlinkError) {
          console.error(`[POST /:id/upload] Gagal menghapus file sementara: ${unlinkError.message}`);
        }
      }
      return res.status(400).json({ message: 'ID tugas tidak valid.' });
    }

    if (!req.file) {
      console.error('[POST /:id/upload] No file uploaded');
      return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
    }

    try {
      console.log('[POST /:id/upload] Checking if tugas exists...');
      const tugasExists = await prisma.tugas.findUnique({
        where: { id: tugasId }
      });

      if (!tugasExists) {
        console.error('[POST /:id/upload] Tugas not found');
        if (fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
            console.log(`[POST /:id/upload] File dihapus karena tugas tidak ditemukan: ${req.file.path}`);
          } catch (unlinkError) {
            console.error(`[POST /:id/upload] Gagal menghapus file setelah tugas tidak ditemukan: ${unlinkError.message}`);
          }
        }
        return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
      }

      console.log('[POST /:id/upload] Checking existing submission...');
      const existingSubmission = await prisma.pengumpulan.findFirst({
        where: {
          tugas_id: tugasId,
          user_id: userId
        }
      });

      let submission;
      if (existingSubmission) {
        console.log('[POST /:id/upload] Updating existing submission...');
        if (existingSubmission.file_path) {
          const oldFilePath = path.join(ROOT_PROJECT_DIR, 'public', 'uploads', existingSubmission.file_path);
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
              console.log(`[POST /:id/upload] File lama dihapus: ${oldFilePath}`);
            } catch (unlinkError) {
              console.error(`[POST /:id/upload] Gagal menghapus file lama ${oldFilePath}: ${unlinkError.message}`);
            }
          } else {
            console.warn(`[POST /:id/upload] File lama tidak ditemukan di: ${oldFilePath}. Mungkin sudah dihapus secara manual atau path salah.`);
          }
        }

        submission = await prisma.pengumpulan.update({
          where: { id: existingSubmission.id },
          data: {
            file_path: req.file.filename,
            waktu_kirim: new Date()
          }
        });
        console.log('[POST /:id/upload] Pengumpulan diperbarui:', submission);
      } else {
        console.log('[POST /:id/upload] Creating new submission...');
        submission = await prisma.pengumpulan.create({
          data: {
            tugas_id: tugasId,
            user_id: userId,
            file_path: req.file.filename,
            waktu_kirim: new Date()
          }
        });
        console.log('[POST /:id/upload] Pengumpulan baru dibuat:', submission);
      }

      console.log('[POST /:id/upload] Success!');
      res.status(200).json({
        message: 'File berhasil diunggah dan disimpan.',
        submission: submission
      });

    } catch (error) {
      console.error('[POST /:id/upload ERROR] Gagal mengunggah file atau menyimpan ke DB:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.error(`[POST /:id/upload] File yang gagal diunggah dihapus: ${req.file.path}`);
        } catch (unlinkError) {
          console.error(`[POST /:id/upload] Gagal menghapus file yang gagal diunggah: ${unlinkError.message}`);
        }
      }
      res.status(500).json({
        message: 'Gagal mengunggah file atau menyimpan ke database.',
        serverError: error.message
      });
    }
  },

  // Hapus pengumpulan tugas
  async hapusPengumpulan(req, res) {
    const tugasId = parseInt(req.params.id);
    const userId = req.session.user ? req.session.user.id : req.user.id;

    if (isNaN(tugasId)) {
      return res.status(400).json({ message: 'ID tugas tidak valid.' });
    }

    try {
      const submission = await prisma.pengumpulan.findFirst({
        where: {
          tugas_id: tugasId,
          user_id: userId
        }
      });

      if (submission) {
        if (submission.file_path) {
          const filePath = path.join(ROOT_PROJECT_DIR, 'public', 'uploads', submission.file_path);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`[DELETE /:id/hapus] File fisik dihapus: ${filePath}`);
            } catch (unlinkError) {
              console.error(`[DELETE /:id/hapus] Gagal menghapus file fisik ${filePath}: ${unlinkError.message}`);
            }
          } else {
            console.warn(`[DELETE /:id/hapus] File fisik tidak ditemukan di: ${filePath}. Mungkin sudah dihapus secara manual atau path salah.`);
          }
        }

        await prisma.pengumpulan.delete({
          where: {
            id: submission.id
          }
        });
        console.log('[DELETE /:id/hapus] Pengumpulan dihapus dari database:', submission.id);
        res.status(200).json({ message: 'File dan pengumpulan berhasil dihapus.' });
      } else {
        res.status(404).json({ message: 'Pengumpulan tidak ditemukan.' });
      }
    } catch (error) {
      console.error('[DELETE /:id/hapus ERROR] Gagal menghapus file atau pengumpulan dari database:', error);
      res.status(500).json({
        message: 'Gagal menghapus file atau pengumpulan dari database.',
        serverError: error.message
      });
    }
  },

  // Unduh file tugas
  async unduhFile(req, res) {
    const tugasId = parseInt(req.params.id);
    const userId = req.session.user ? req.session.user.id : req.user.id;

    if (isNaN(tugasId)) {
      return res.status(400).send('ID tugas tidak valid.');
    }

    try {
      const submission = await prisma.pengumpulan.findFirst({
        where: {
          tugas_id: tugasId,
          user_id: userId
        }
      });

      if (submission && submission.file_path) {
        const filePath = path.join(ROOT_PROJECT_DIR, 'public', 'uploads', submission.file_path);
        if (fs.existsSync(filePath)) {
          res.download(filePath, submission.file_path);
        } else {
          console.warn(`[GET /:id/unduh] File fisik tidak ditemukan di: ${filePath}`);
          res.status(404).send('File fisik tidak ditemukan di server.');
        }
      } else {
        res.status(404).send('Pengumpulan atau file tidak ditemukan.');
      }
    } catch (error) {
      console.error('[GET /:id/unduh ERROR] Terjadi kesalahan saat mengunduh file:', error);
      res.status(500).send('Terjadi kesalahan saat mengunduh file. Detail: ' + error.message);
    }
  }
};

module.exports = tugasController; 