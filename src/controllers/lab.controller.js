const prisma = require('../../prisma/client');

const labPage = async (req, res) => {
    try {
        // Ambil daftar praktikum beserta lab-nya
        const praktikumList = await prisma.praktikum.findMany({
            include: { lab: true },
            orderBy: { dibuat_pada: 'asc' },
        });

        // Ambil nama lab dari salah satu praktikum (jika ada)
        const namaLab = praktikumList.length > 0 && praktikumList[0].lab
            ? praktikumList[0].lab.nama_lab
            : 'Tidak Diketahui';

        res.render('lab', {
            user: req.session.user,
            praktikumList,
            lab: { nama_lab: namaLab } // agar bisa diakses di EJS sebagai lab.nama_lab
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

        res.render('homeClass', {
            user: req.session.user,
            praktikum,
            studentCount: 94, // bisa diganti query count user per kelas
            nextSchedule: "23 Juli 2025", // ganti dengan data jadwal
            latestAssignment: {
                title: "Tugas Praktikum 5",
                deadlineDate: "Senin, 14 Juli 2025",
                deadlineTime: "23:59",
                status: "Dibuka"
            }
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