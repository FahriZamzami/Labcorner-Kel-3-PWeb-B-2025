const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticationController = {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Cari user berdasarkan username
            const user = await prisma.user.findFirst({
                where: { username }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah'
                });
            }

            // Untuk sementara, password validation diabaikan (untuk testing)
            // Dalam implementasi nyata, gunakan bcrypt untuk compare password

            // Set session
            req.session.user = {
                id: user.id,
                username: user.username,
                peran: user.peran
            };

            console.log('Login berhasil untuk:', user.username, 'Peran:', user.peran);

            // Redirect berdasarkan peran
            if (user.peran === 'mahasiswa') {
                // Mahasiswa diarahkan ke dashboard kelas
                res.redirect('/dashboard-kelas');
            } else if (user.peran === 'asisten') {
                // Asisten diarahkan ke dashboard
                res.redirect('/dashboard');
            } else {
                // Default redirect
                res.redirect('/home');
            }

        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat login'
            });
        }
    },

    async logout(req, res) {
        try {
            // Destroy session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Error logging out');
                }
                res.redirect('/login');
            });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).send('Error logging out');
        }
    }
};

module.exports = authenticationController;
