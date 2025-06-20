const prisma = require('../../prisma/client');
const path = require('path');
const fs = require('fs');

// Buat assignment baru
const createAssignment = async (req, res) => {
    try {
        const { judul, deskripsi, tanggal, jam, otomatis } = req.body;
        const praktikum_id = parseInt(req.body.praktikum_id || req.session.idKelasDipilih);
        const batas_waktu = new Date(`${tanggal}T${jam}`);
        let fileTugas = null;

        if (req.file) {
            fileTugas = req.file.filename;
        }

        await prisma.tugas.create({
            data: {
                praktikum_id,
                judul,
                deskripsi,
                fileTugas,
                batas_waktu,
                tutup_penugasan: otomatis === 'on'
            },
        });

        res.redirect('/assignments');
    } catch (error) {
        console.error('🛑 ERROR SAAT CREATE ASSIGNMENT:', error);
        res.status(500).json({ error: 'Gagal membuat assignment' });
    }
};

// Menutup otomatis tugas
const autoCloseAssignments = async () => {
    try {
        const now = new Date();

        await prisma.tugas.updateMany({
            where: {
                tutup_penugasan: true,
                status: 'open',
                batas_waktu: {
                    lt: now
                }
            },
            data: {
                status: 'close'
            }
        });

        console.log('✅ Penugasan otomatis ditutup.');
    } catch (err) {
        console.error('❌ Gagal menutup penugasan otomatis:', err);
    }
};

// Ambil semua penugasan
const getAllAssignments = async (req, res) => {
    try {
        const praktikumId = parseInt(req.params.id || req.session.idKelasDipilih);

        if (!praktikumId) {
            return res.status(400).send("ID kelas belum dipilih.");
        }

        req.session.idKelasDipilih = praktikumId;

        const assignments = await prisma.tugas.findMany({
            where: { praktikum_id: praktikumId },
            orderBy: { dibuat_pada: 'asc' }
        });

        res.render('daftarAssignments', {
            assignments,
            user: req.session.user
        });
    } catch (error) {
        console.error('Gagal mengambil assignment:', error);
        res.status(500).send('Terjadi kesalahan.');
    }
};

// Toggle status (open <-> close)
const toggleStatusAssignments = async (req, res) => {
    const { id } = req.params;

    try {
        const tugas = await prisma.tugas.findUnique({ where: { id: Number(id) } });

        if (!tugas) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        }

        const statusBaru = tugas.status === 'open' ? 'close' : 'open';

        await prisma.tugas.update({
            where: { id: Number(id) },
            data: { status: statusBaru },
        });

        return res.json({ success: true, status: statusBaru });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Form edit assignment
const editAssignmentForm = async (req, res) => {
    const id = Number(req.params.id);
    const assignment = await prisma.tugas.findUnique({ where: { id } });
    if (!assignment) return res.status(404).send('Penugasan tidak ditemukan');

    const praktikum = await prisma.praktikum.findUnique({
        where: { id: assignment.praktikum_id }
    });

    res.render('editAssignment', { assignment, praktikum });
};

// Update assignment
const updateAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const { judul, deskripsi, tanggal, jam, otomatis } = req.body;

    const batas_waktu = new Date(`${tanggal}T${jam}`);
    const fileTugas = req.file ? req.file.filename : undefined;

    await prisma.tugas.update({
        where: { id },
        data: {
            judul,
            deskripsi,
            batas_waktu,
            tutup_penugasan: otomatis === 'on',
            ...(fileTugas && { fileTugas })
        }
    });

    res.redirect(`/penugasan/detail/${id}`);
};

// Hapus assignment
const deleteAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const assignment = await prisma.tugas.delete({ where: { id } });
    res.redirect(`/kelas/${assignment.praktikum_id}/penugasan`);
};

// Detail assignment (untuk mahasiswa submit)
const detailAssignment = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const assignment = await prisma.tugas.findUnique({ where: { id } });

        if (!assignment) return res.status(404).send('Penugasan tidak ditemukan');

        const praktikum = await prisma.praktikum.findUnique({
            where: { id: assignment.praktikum_id }
        });

        let submission = null;
        if (req.session.user?.id) {
            submission = await prisma.pengumpulan.findFirst({
                where: {
                    tugas_id: id,
                    user_id: req.session.user.id
                }
            });
        }

        res.render('detailAssignment', {
            assignment: {
                ...assignment,
                nama_file: assignment.fileTugas,
                path_file: assignment.fileTugas
            },
            praktikum,
            submission
        });
    } catch (error) {
        console.error('❌ Gagal render detail penugasan:', error);
        res.status(500).send('Terjadi kesalahan');
    }
};

// Daftar pengumpulan
const getPengumpulanByTugasId = async (req, res) => {
    const tugasId = Number(req.params.id);

    try {
        const assignment = await prisma.tugas.findUnique({
            where: { id: tugasId }
        });

        if (!assignment) return res.status(404).send('Tugas tidak ditemukan');

        const praktikum = await prisma.praktikum.findUnique({
            where: { id: assignment.praktikum_id }
        });

        // Ambil pengumpulan & nama user
        const submissions = await prisma.pengumpulan.findMany({
            where: { tugas_id: tugasId },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                waktu_kirim: 'desc'
            }
        });

        // Format tanggal & waktu pengumpulan
        const formatted = submissions.map(sub => {
            const waktu = new Date(sub.waktu_kirim);
            return {
                ...sub,
                hari: waktu.toLocaleDateString('id-ID', { weekday: 'long' }),
                tanggal: waktu.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                jam: waktu.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
            };
        });

        res.render('pengumpulan', {
            assignment,
            praktikum,
            submissions: formatted,
            user: req.session.user,
            activeTab: 'pengumpul' // 👈 ini penting untuk tab navigasi
        });

    } catch (err) {
        console.error('❌ Gagal mengambil data pengumpulan:', err);
        res.status(500).send('Terjadi kesalahan saat mengambil data pengumpulan');
    }
};

// Tampilkan file yang dikumpulkan oleh mahasiswa
const getFilesByTugasId = async (req, res) => {
    const tugasId = Number(req.params.id);

    try {
        const assignment = await prisma.tugas.findUnique({
            where: { id: tugasId }
        });

        if (!assignment) return res.status(404).send('Tugas tidak ditemukan');

        const praktikum = await prisma.praktikum.findUnique({
            where: { id: assignment.praktikum_id }
        });

        const submissions = await prisma.pengumpulan.findMany({
            where: {
                tugas_id: tugasId,
                NOT: { file_path: null }  // ← ✅ GANTI INI
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                waktu_kirim: 'desc'
            }
        });

        const formatted = submissions.map(sub => ({
            ...sub,
            nama_file: sub.file_path,    // ✅ benar
            path_file: sub.file_path,    // ✅ benar
            dikumpulkan_pada: sub.waktu_kirim
        }));

        res.render('filePengumpulan', {
            assignment,
            praktikum,
            submissions: formatted,
            user: req.session.user,
            activeTab: 'file'
        });

    } catch (err) {
        console.error('❌ Gagal mengambil file pengumpulan:', err);
        res.status(500).send('Terjadi kesalahan saat mengambil file pengumpulan');
    }
};

// Ekspor fungsi
module.exports = {
    createAssignment,
    getAllAssignments,
    toggleStatusAssignments,
    editAssignmentForm,
    updateAssignment,
    deleteAssignment,
    detailAssignment,
    autoCloseAssignments,
    getPengumpulanByTugasId,
    getFilesByTugasId
};