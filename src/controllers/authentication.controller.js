const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');

const login = async (req, res) => {
    const { id, kata_sandi } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(401).send('ID tidak ditemukan');
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

            const lab = await prisma.lab.findUnique({
                where: { id: asisten.lab_id },
                include: {
                    praktikum: true
                }
            });

            if (!lab) {
                return res.status(404).send('Lab tidak ditemukan');
            }

            return res.render('lab', {
                user,
                lab,
                praktikumList: lab.praktikum
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