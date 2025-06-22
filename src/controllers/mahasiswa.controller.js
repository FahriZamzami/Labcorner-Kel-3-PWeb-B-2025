// src/controllers/mahasiswa.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan halaman daftar mahasiswa dalam satu praktikum
const getDaftarMahasiswaPage = async (req, res) => {
    try {
        const praktikumId = parseInt(req.params.praktikum_id, 10);
        const praktikum = await prisma.praktikum.findUnique({ where: { id: praktikumId } });

        if (!praktikum) {
            return res.status(404).send('Praktikum tidak ditemukan');
        }

        // Ambil daftar mahasiswa dan sertakan data user (untuk nama & nim)
        const mahasiswaList = await prisma.mahasiswa.findMany({
            where: { praktikum_id: praktikumId },
            include: {
                user: {
                    select: {
                        id: true, // NIM
                        username: true // Nama
                    }
                }
            },
            orderBy: { user: { id: 'asc' } } // Urutkan berdasarkan NIM
        });

        res.render('daftarMahasiswa', {
            title: `Daftar Mahasiswa - ${praktikum.nama_praktikum}`,
            praktikum,
            mahasiswaList,
        });
    } catch (error) {
        console.error("Error fetching mahasiswa list:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

module.exports = { getDaftarMahasiswaPage };