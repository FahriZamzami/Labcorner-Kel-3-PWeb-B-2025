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

    // Simpan data user ke session
    req.session.user = {
        id: user.id,
        username: user.username,
        peran: user.peran
    };

    // Arahkan berdasarkan peran
    if (user.peran === 'admin') {
        return res.render('admin', { user });
    } else if (user.peran === 'asisten') {
    return res.redirect('/lab');
    } else if (user.peran === 'mahasiswa') {
        return res.render('mahasiswa', { user });
    } else {
        return res.status(403).send('Peran tidak dikenali');
    }

    } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server');
    }
};

module.exports = { login };
