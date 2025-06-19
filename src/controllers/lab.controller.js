const prisma = require('../../prisma/client');

const labPage = async (req, res) => {
    try {
        const praktikumList = await prisma.praktikum.findMany({
            include: { lab: true },
            orderBy: { dibuat_pada: 'desc' },
        });

        res.render('lab', {
            user: req.session.user,
            praktikumList
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal mengambil data praktikum');
    }
};

const showHomeClassPage = async (req, res) => {
    const kelasId = parseInt(req.params.id);

    try {
        // Validasi ID
        if (isNaN(kelasId)) {
            return res.status(400).send('ID kelas tidak valid');
        }

        // Simpan ID kelas ke dalam session
        req.session.idKelasDipilih = kelasId;

        // Langsung render halaman tanpa query DB
        res.render('homeClass', {
            user: req.session.user,
            idKelas: kelasId
        });

    } catch (err) {
        console.error('❌ Error saat menyimpan ID kelas ke session:', err);
        res.status(500).send('Terjadi kesalahan saat menampilkan halaman kelas');
    }
};

module.exports = {
    labPage,
    showHomeClassPage // <- tambahkan ini
};