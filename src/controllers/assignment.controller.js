const prisma = require('../../prisma/client');
const path = require('path');
const fs = require('fs');

const createAssignment = async (req, res) => {
    try {
        const { judul, deskripsi, tanggal, jam, otomatis } = req.body;
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
                tutup_penugasan: otomatis === 'on' // checkbox akan kirim 'on' jika dicentang
            },
        });

        res.redirect('/assignments');
    } catch (error) {
        console.error('🛑 ERROR SAAT CREATE ASSIGNMENT:', error);
        res.status(500).json({ error: 'Gagal membuat assignment' });
    }
};

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

        console.log('✅ Penugasan otomatis ditutup jika sudah melewati batas waktu.');
    } catch (err) {
        console.error('❌ Gagal menutup penugasan otomatis:', err);
    }
};

const getAllAssignments = async (req, res) => {
    try {
        const praktikumId = parseInt(req.params.id || req.session.idKelasDipilih);

        if (!praktikumId) {
            return res.status(400).send("ID kelas belum dipilih. Silakan kembali ke halaman lab.");
        }

        // Simpan ke session agar form create/edit bisa tetap mengaksesnya
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
        res.status(500).send('Terjadi kesalahan saat mengambil data assignment');
    }
};

const toggleStatusAssignments = async (req, res) => {
    const { id } = req.params;

    try {
        const tugas = await prisma.tugas.findUnique({
            where: { id: Number(id) },
        });

        if (!tugas) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        }

        const statusBaru = tugas.status === 'open' ? 'close' : 'open';

        await prisma.tugas.update({
            where: { id: Number(id) },
            data: { status: statusBaru },
        });

        // ✅ Ganti redirect dengan JSON response
        return res.json({ success: true, status: statusBaru });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Tampilkan form edit
const editAssignmentForm = async (req, res) => {
    const id = Number(req.params.id);
    const assignment = await prisma.tugas.findUnique({ where: { id } });
    if (!assignment) return res.status(404).send('Penugasan tidak ditemukan');

  // Asumsikan kamu punya data praktikum
    const praktikum = await prisma.praktikum.findUnique({
        where: { id: assignment.praktikum_id }
    });

    res.render('editAssignment', { assignment, praktikum });
};

// Proses update assignment
const updateAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const { judul, deskripsi, tanggal, jam, otomatis } = req.body;

    const batas_waktu = new Date(`${tanggal}T${jam}`);
    const fileTugas = req.file ? req.file.filename : undefined;

    const updated = await prisma.tugas.update({
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

// Proses delete assignment
const deleteAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const assignment = await prisma.tugas.delete({ where: { id } });
    res.redirect(`/kelas/${assignment.praktikum_id}/penugasan`);
};

const detailAssignment = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const assignment = await prisma.tugas.findUnique({
            where: { id }
        });

        if (!assignment) {
            return res.status(404).send('Penugasan tidak ditemukan');
        }

        // Ambil data praktikum
        const praktikum = await prisma.praktikum.findUnique({
            where: { id: assignment.praktikum_id }
        });

        // Ambil submission pengguna jika login
        let submission = null;
        if (req.session.user && req.session.user.id) {
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
            submission // ✅ penting: pastikan variabel ini dikirim ke view
        });
    } catch (error) {
        console.error('❌ Gagal render detail penugasan:', error);
        res.status(500).send('Terjadi kesalahan saat mengambil detail penugasan');
    }
};

module.exports = {
    createAssignment,
    getAllAssignments,
    toggleStatusAssignments,
    editAssignmentForm,
    updateAssignment,
    deleteAssignment,
    detailAssignment, // ✅ ditambahkan
    autoCloseAssignments // ✅ tambahkan fungsi penutup otomatis
};