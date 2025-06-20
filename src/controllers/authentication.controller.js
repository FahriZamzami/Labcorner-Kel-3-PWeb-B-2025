const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');

const login = async (req, res) => {
    const { username, kata_sandi } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).send('Username tidak ditemukan');
        }

        const isPasswordValid = user.peran === 'admin'
            ? await bcrypt.compare(kata_sandi, user.kata_sandi)
            : user.kata_sandi === kata_sandi;

        if (!isPasswordValid) {
            return res.status(401).send('Password salah');
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            peran: user.peran
        };

        if (user.peran === 'admin') {
            return res.render('admin', { user });
        }

        if (user.peran === 'asisten') {
            const asisten = await prisma.asistenLab.findFirst({
                where: { user_id: user.id }
            });

            if (!asisten) {
                return res.status(404).send('Data asisten tidak ditemukan');
            }

            // Dapatkan detail lab & daftar praktikum (jika ada)
            const lab = await prisma.lab.findUnique({
                where: { id: asisten.lab_id },
                include: {
                    praktikum: true // jika ada relasi ke tabel praktikum
                }
            });

            if (!lab) {
                return res.status(404).send('Lab tidak ditemukan');
            }

            return res.render('lab', {
                user,
                lab,
                praktikumList: lab.praktikum // untuk ditampilkan di EJS
            });
        }

        if (user.peran === 'mahasiswa') {
            return res.render('mahasiswa', { user });
        }

        return res.status(403).send('Peran tidak dikenali');
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send('Terjadi kesalahan server: ' + error.message);
    }
};

module.exports = { login };