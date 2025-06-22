const prisma = require('../../prisma/client');

// src/controllers/lab.controller.js

const labPage = async (req, res) => {
    try {
        // Dapatkan informasi user yang login dari session
        const user = req.session.user;

        // Jika tidak ada user di session, kembalikan ke login
        if (!user) {
            return res.redirect('/login');
        }

        let praktikumList = [];

        // ==== PERBAIKAN DI SINI ====
        // Cek peran user dengan .toLowerCase() agar tidak case-sensitive
        if (user.peran?.toLowerCase() === 'asisten') {
            // --- LOGIKA UNTUK ASISTEN ---

            // 1. Cari semua lab tempat asisten ini bertugas
            const asistenLabs = await prisma.asistenLab.findMany({
                where: { user_id: user.id },
                select: { lab_id: true }
            });

            // 2. Jika asisten tidak ditugaskan di lab manapun, daftar praktikum akan kosong
            if (asistenLabs.length > 0) {
                const allowedLabIds = asistenLabs.map(al => al.lab_id);

                // 3. Filter praktikum berdasarkan ID lab yang diizinkan
                praktikumList = await prisma.praktikum.findMany({
                    where: {
                        lab_id: { in: allowedLabIds }
                    },
                    include: { lab: true },
                    orderBy: { dibuat_pada: 'asc' },
                });
            }
            
        } else {
            // --- LOGIKA UNTUK ADMIN / PERAN LAIN ---
            // Ambil semua praktikum tanpa filter
            praktikumList = await prisma.praktikum.findMany({
                include: { lab: true },
                orderBy: { dibuat_pada: 'asc' },
            });
        }

        const namaLab = praktikumList.length > 0 && praktikumList[0].lab
            ? praktikumList[0].lab.nama_lab
            : 'Laboratorium';

        res.render('lab', {
            user: req.session.user,
            praktikumList,
            lab: { nama_lab: namaLab }
        });
    } catch (err) {
        console.error('❌ Error di labPage:', err);
        res.status(500).send('Gagal mengambil data praktikum');
    }
};

const showHomeClassPage = async (req, res) => {
    const kelasId = parseInt(req.params.id);

    try {
        if (isNaN(kelasId)) {
            return res.status(400).send('ID kelas tidak valid');
        }

        // Simpan ID kelas ke session
        req.session.idKelasDipilih = kelasId;

        // Ambil data praktikum
        const praktikum = await prisma.praktikum.findUnique({
            where: { id: kelasId }
        });

        if (!praktikum) {
            return res.status(404).send('Praktikum tidak ditemukan');
        }

        // Hitung jumlah mahasiswa
        const studentCount = await prisma.mahasiswa.count({
            where: { praktikum_id: kelasId }
        });

        // Ambil jadwal praktikum terdekat
        const jadwalBerikutnya = await prisma.jadwal.findFirst({
            where: {
                praktikum_id: kelasId,
                tanggal: { gte: new Date() }
            },
            orderBy: { tanggal: 'asc' }
        });

        const nextSchedule = jadwalBerikutnya
            ? jadwalBerikutnya.tanggal.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            : 'Tidak ada jadwal';

        // Ambil penugasan terakhir
        const tugasTerakhir = await prisma.tugas.findFirst({
            where: { praktikum_id: kelasId },
            orderBy: { batas_waktu: 'desc' }
        });

        const latestAssignment = tugasTerakhir
            ? {
                title: tugasTerakhir.judul || 'Tanpa Judul',
                deadlineDate: tugasTerakhir.batas_waktu?.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }) || '-',
                deadlineTime: tugasTerakhir.batas_waktu?.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).replace('.', ':') || '-',
                status: tugasTerakhir.status || 'Dibuka'
            }
            : {
                title: 'Belum ada penugasan',
                deadlineDate: '-',
                deadlineTime: '',
                status: '-'
            };

        // Render halaman
        res.render('homeClass', {
            user: req.session.user,
            praktikum: {
                ...praktikum,
                startDate: praktikum.dibuat_pada?.toLocaleDateString('id-ID') || '-',
            },
            studentCount,
            nextSchedule,
            latestAssignment
        });

    } catch (err) {
        console.error('❌ Error saat render halaman homeClass:', err);
        res.status(500).send('Terjadi kesalahan saat menampilkan halaman kelas');
    }
};

module.exports = {
    labPage,
    showHomeClassPage
};