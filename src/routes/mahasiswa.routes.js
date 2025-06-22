// src/routes/mahasiswa.routes.js
const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/client'); // Sesuaikan path

// Route untuk menampilkan daftar mahasiswa yang terdaftar di praktikum yang sedang aktif
router.get('/', async (req, res) => {
    const currentLab = req.session.currentLab;

    if (!currentLab) {
        req.flash('error', 'Anda harus memilih praktikum terlebih dahulu untuk melihat daftar mahasiswa.');
        return res.redirect('/pilihLab');
    }

    try {
        const daftarMahasiswa = await prisma.pendaftaran.findMany({
            where: { praktikum_id: currentLab.id },
            include: { user: { select: { username: true } } }, // Ambil data user mahasiswa
            orderBy: { user: { username: 'asc' } }
        });

        res.render('daftarMahasiswa', {
            currentLab: currentLab,
            daftarMahasiswa: daftarMahasiswa,
            currentPage: 'mahasiswa' // Anda bisa menambah ini di sidebar jika perlu
        });

    } catch (error) {
        console.error('Error fetching enrolled students:', error);
        req.flash('error', 'Terjadi kesalahan saat mengambil daftar mahasiswa.');
        res.redirect('/dashboard');
    }
});

module.exports = router;