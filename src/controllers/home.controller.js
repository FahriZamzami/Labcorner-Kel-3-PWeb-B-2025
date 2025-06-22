// src/controllers/home.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getHomePage = async (req, res) => {
    try {
        const user = req.session.user;
        const { praktikumId } = req.query; // Ambil praktikumId dari query URL

        // ===================================================
        // #### LOGIKA BARU DITAMBAHKAN DI SINI ####
        // ===================================================
        // Jika ada praktikumId di URL, artinya user memilih kelas spesifik
        if (praktikumId) {
            const id = parseInt(praktikumId);
            // Simpan ID kelas yang dipilih ke session
            req.session.idKelasDipilih = id;
            // Langsung arahkan ke halaman detail kelas tersebut
            return res.redirect(`/kelas/${id}`);
        }

        // Jika tidak ada praktikumId di URL, tampilkan dashboard seperti biasa
        const kelasDiikuti = await prisma.mahasiswa.findMany({
            where: { user_id: user.id },
            include: {
                praktikum: {
                    include: {
                        lab: true
                    }
                }
            },
            orderBy: {
                praktikum: { dibuat_pada: 'desc' }
            }
        });

        const praktikumList = kelasDiikuti.map(item => item.praktikum);

        res.render('home', {
            title: 'Dashboard Utama',
            user,
            praktikumList
        });
    } catch (error) {
        console.error("Error fetching home page:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

module.exports = { 
    getHomePage 
}