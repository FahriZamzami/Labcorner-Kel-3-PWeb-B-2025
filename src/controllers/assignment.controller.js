const prisma = require('../../prisma/client');
const path = require('path');
const fs = require('fs');

const createAssignment = async (req, res) => {
    try {
        const { judul, deskripsi, tanggal, jam } = req.body;

        const praktikum_id = parseInt(req.body.praktikum_id || req.session.idKelasDipilih);

        const batas_waktu = new Date(`${tanggal}T${jam}`);
        let fileTugas = null;

        if (req.file) {
            fileTugas = req.file.filename;
        }

        const assignment = await prisma.tugas.create({
            data: {
                praktikum_id,
                judul,
                deskripsi,
                fileTugas,
                batas_waktu,
            },
        });

        res.redirect('/assignments');
    } catch (error) {
        console.error('🛑 ERROR SAAT CREATE ASSIGNMENT:', error);
        res.status(500).json({ error: 'Gagal membuat assignment' });
    }
};

const getAllAssignments = async (req, res) => {
    try {
        const praktikumId = req.session.idKelasDipilih;

        if (!praktikumId) {
            return res.status(400).send("ID kelas belum dipilih. Silakan kembali ke halaman lab.");
        }

        const assignments = await prisma.tugas.findMany({
            where: {
                praktikum_id: praktikumId,
            },
            orderBy: {
                batas_waktu: 'asc', // opsional
            }
        });

        res.render('daftarAssignments', {
            assignments,
            user: req.session.user // jika kamu pakai user
        });
    } catch (error) {
        console.error('Gagal mengambil assignment:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil data assignment');
    }
};

module.exports = {
    createAssignment,
    getAllAssignments
};