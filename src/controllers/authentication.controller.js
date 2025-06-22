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

        // Redirect based on role to ensure the URL is correct
        switch (user.peran) {
            case 'admin':
                return res.redirect('/lab'); // Redirect admin to lab/dashboard
            case 'asisten':
                return res.redirect('/lab'); // Redirect asisten to lab
            case 'mahasiswa':
                return res.redirect('/lab'); // Redirect mahasiswa to their dashboard/lab
            default:
                // If role is not recognized, deny access
                return res.status(403).send('Peran tidak dikenali');
        }

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send('Terjadi kesalahan server: ' + error.message);
    }
};

module.exports = { login };