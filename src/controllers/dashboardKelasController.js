const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dashboardKelasController = {
    // Menampilkan dashboard kelas mahasiswa
    async getDashboardKelas(req, res) {
        try {
            console.log('=== DASHBOARD KELAS CONTROLLER ===');
            
            // Ambil user yang sedang login
            let currentUser = req.session.user;
            
            if (!currentUser) {
                console.log('User tidak terautentikasi, redirect ke login');
                return res.redirect('/login');
            }

            console.log('User terautentikasi:', currentUser.username, 'Peran:', currentUser.peran);

            // Pastikan user adalah mahasiswa
            if (currentUser.peran !== 'mahasiswa') {
                console.log('User bukan mahasiswa, akses ditolak');
                return res.status(403).send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Akses Ditolak - Labcorner</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body class="bg-gradient-to-br from-red-50 to-pink-50 min-h-screen flex items-center justify-center">
                        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
                            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <i class="fas fa-exclamation-triangle text-3xl text-red-600">⚠️</i>
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
                            <p class="text-gray-600 mb-6">
                                Dashboard Kelas hanya dapat diakses oleh mahasiswa.
                                <br><br>
                                <strong>User saat ini:</strong> ${currentUser.username} (${currentUser.peran})
                            </p>
                            <div class="space-y-3">
                                <a href="/login-mahasiswa" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                                    Login sebagai Mahasiswa
                                </a>
                                <a href="/" class="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors">
                                    Kembali ke Beranda
                                </a>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
            }

            // Ambil semua kelas praktikum dari database
            const semuaKelas = await prisma.praktikum.findMany({
                include: {
                    lab: true
                },
                orderBy: {
                    nama_praktikum: 'asc'
                }
            });

            // Ambil kelas yang sudah dimasuki mahasiswa untuk menandai status
            const kelasMasuk = await prisma.pendaftaran.findMany({
                where: {
                    user_id: currentUser.id
                },
                select: {
                    praktikum_id: true
                }
            });

            const kelasMasukIds = kelasMasuk.map(k => k.praktikum_id);

            // Tambahkan status terdaftar ke setiap kelas
            const kelasDenganStatus = semuaKelas.map(kelas => ({
                ...kelas,
                sudahTerdaftar: kelasMasukIds.includes(kelas.id)
            }));

            console.log('Total kelas tersedia:', semuaKelas.length);
            console.log('Kelas yang sudah dimasuki:', kelasMasukIds.length);

            res.render('dashboardKelas', {
                currentUser: currentUser,
                semuaKelas: kelasDenganStatus,
                currentPage: 'dashboardKelas',
                currentLab: req.session.currentLab || null
            });

        } catch (error) {
            console.error('Error in dashboard kelas:', error);
            res.status(500).send('Terjadi kesalahan saat mengambil data dashboard kelas.');
        }
    },

    // Proses masuk kelas (validasi kode akses)
    async masukKelas(req, res) {
        try {
            console.log('=== MASUK KELAS CONTROLLER ===');
            console.log('Request body:', req.body);
            console.log('Session ID:', req.sessionID);
            console.log('Full session:', JSON.stringify(req.session, null, 2));
            
            const { kodeMasuk } = req.body;
            const currentUser = req.session.user;

            console.log('Kode masuk yang diterima:', kodeMasuk);
            console.log('Current user:', currentUser);
            console.log('Current user type:', typeof currentUser);
            console.log('Current user peran:', currentUser ? currentUser.peran : 'undefined');

            if (!currentUser) {
                console.log('❌ User tidak ada di session');
                return res.status(403).json({
                    success: false,
                    message: 'Session tidak valid. Silakan login ulang.'
                });
            }

            if (currentUser.peran !== 'mahasiswa') {
                console.log('❌ User bukan mahasiswa, peran:', currentUser.peran);
                return res.status(403).json({
                    success: false,
                    message: 'Akses ditolak. Hanya mahasiswa yang dapat mengakses fitur ini.'
                });
            }

            console.log('✅ User valid, mencoba masuk kelas dengan kode:', kodeMasuk);

            // Cari praktikum berdasarkan kode masuk
            const praktikum = await prisma.praktikum.findUnique({
                where: {
                    kode_masuk: kodeMasuk
                },
                include: {
                    lab: true
                }
            });

            console.log('Hasil pencarian praktikum:', praktikum);

            if (!praktikum) {
                console.log('❌ Praktikum tidak ditemukan untuk kode:', kodeMasuk);
                return res.status(404).json({
                    success: false,
                    message: 'Kode kelas tidak valid atau kelas tidak ditemukan.'
                });
            }

            // Cek apakah sudah terdaftar di kelas ini
            const sudahTerdaftar = await prisma.pendaftaran.findFirst({
                where: {
                    user_id: currentUser.id,
                    praktikum_id: praktikum.id
                }
            });

            console.log('Cek sudah terdaftar:', sudahTerdaftar);

            if (sudahTerdaftar) {
                console.log('❌ User sudah terdaftar di kelas ini');
                return res.status(400).json({
                    success: false,
                    message: 'Anda sudah terdaftar di kelas ini.'
                });
            }

            // Daftar ke kelas
            const pendaftaranBaru = await prisma.pendaftaran.create({
                data: {
                    user_id: currentUser.id,
                    praktikum_id: praktikum.id,
                    waktu_daftar: new Date()
                }
            });

            console.log('✅ Pendaftaran baru berhasil:', pendaftaranBaru);

            // Set session currentLab
            req.session.currentLab = {
                id: praktikum.id,
                nama_praktikum: praktikum.nama_praktikum,
                lab_id: praktikum.lab_id,
                lab: praktikum.lab
            };

            console.log('✅ Session currentLab diset:', req.session.currentLab);
            console.log('✅ Berhasil masuk kelas:', praktikum.nama_praktikum);

            res.json({
                success: true,
                message: 'Berhasil masuk kelas!',
                redirectUrl: '/home',
                praktikum: {
                    id: praktikum.id,
                    nama_praktikum: praktikum.nama_praktikum,
                    lab: praktikum.lab.nama_lab
                }
            });

        } catch (error) {
            console.error('❌ Error masuk kelas:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat masuk kelas: ' + error.message
            });
        }
    },

    // Masuk ke kelas yang sudah terdaftar (tanpa kode akses)
    async masukKelasTerdaftar(req, res) {
        try {
            console.log('=== MASUK KELAS TERDAFTAR CONTROLLER ===');
            
            const { praktikumId } = req.params;
            const currentUser = req.session.user;

            if (!currentUser || currentUser.peran !== 'mahasiswa') {
                return res.status(403).json({
                    success: false,
                    message: 'Akses ditolak. Hanya mahasiswa yang dapat mengakses fitur ini.'
                });
            }

            // Cek apakah sudah terdaftar di kelas ini
            const pendaftaran = await prisma.pendaftaran.findFirst({
                where: {
                    user_id: currentUser.id,
                    praktikum_id: parseInt(praktikumId)
                },
                include: {
                    praktikum: {
                        include: {
                            lab: true
                        }
                    }
                }
            });

            if (!pendaftaran) {
                return res.status(404).json({
                    success: false,
                    message: 'Anda belum terdaftar di kelas ini.'
                });
            }

            // Set session currentLab
            req.session.currentLab = {
                id: pendaftaran.praktikum.id,
                nama_praktikum: pendaftaran.praktikum.nama_praktikum,
                lab_id: pendaftaran.praktikum.lab_id
            };

            console.log('Berhasil masuk ke kelas terdaftar:', pendaftaran.praktikum.nama_praktikum);

            res.json({
                success: true,
                message: 'Berhasil masuk ke kelas!',
                praktikum: {
                    id: pendaftaran.praktikum.id,
                    nama_praktikum: pendaftaran.praktikum.nama_praktikum,
                    lab: pendaftaran.praktikum.lab.nama_lab
                }
            });

        } catch (error) {
            console.error('Error masuk kelas terdaftar:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat masuk kelas.'
            });
        }
    }
};

module.exports = dashboardKelasController; 