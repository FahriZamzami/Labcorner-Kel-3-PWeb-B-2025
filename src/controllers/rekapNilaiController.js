const { PrismaClient } = require('@prisma/client');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

const rekapNilaiController = {
    // Menampilkan halaman rekap nilai
    async getRekapNilai(req, res) {
        try {
            console.log('=== REKAP NILAI CONTROLLER ===');
            console.log('Session user:', req.session.user);
            
            // Ambil user yang sedang login dari session
            let currentUser = req.session.user;
            
            // Jika tidak ada user yang login, gunakan user mahasiswa pertama sebagai default
            if (!currentUser) {
                console.log('User tidak terautentikasi, mencari user mahasiswa default...');
                
                const defaultMahasiswa = await prisma.user.findFirst({
                    where: { peran: 'mahasiswa' }
                });
                
                if (defaultMahasiswa) {
                    currentUser = {
                        id: defaultMahasiswa.id,
                        username: defaultMahasiswa.username,
                        peran: defaultMahasiswa.peran
                    };
                    
                    // Set session untuk user ini
                    req.session.user = currentUser;
                    console.log('Menggunakan user default:', currentUser.username);
                } else {
                    console.log('Tidak ada user mahasiswa di database');
                    return res.status(404).send('Tidak ada data mahasiswa di database');
                }
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
                                Halaman Rekap Nilai hanya dapat diakses oleh mahasiswa.
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

            console.log('Mencari data pengumpulan untuk user ID:', currentUser.id);

            // Ambil data rekap nilai hanya untuk mahasiswa yang sedang login
            const rekapNilai = await prisma.pengumpulan.findMany({
                include: {
                    user: {
                        select: {
                            username: true,
                            peran: true
                        }
                    },
                    tugas: {
                        select: {
                            judul: true
                        }
                    }
                },
                where: {
                    user_id: currentUser.id
                },
                orderBy: [
                    { tugas: { judul: 'asc' } }
                ]
            });

            console.log('Data rekap nilai ditemukan:', rekapNilai.length);

            // Hitung nilai rata-rata keseluruhan untuk mahasiswa ini
            const nilaiValues = rekapNilai
                .filter(item => item.nilai !== null)
                .map(item => item.nilai);
            
            const nilaiRataRata = nilaiValues.length > 0 
                ? (nilaiValues.reduce((sum, nilai) => sum + nilai, 0) / nilaiValues.length).toFixed(2)
                : 0;

            // Hitung jumlah tugas
            const jumlahTugas = nilaiValues.length;

            console.log('Nilai rata-rata:', nilaiRataRata);
            console.log('Jumlah tugas:', jumlahTugas);

            res.render('rekapNilai', {
                rekapNilai: rekapNilai,
                namaMahasiswa: currentUser.username,
                nilaiRataRata: nilaiRataRata,
                jumlahTugas: jumlahTugas,
                currentPage: 'rekapNilai',
                currentLab: req.session.currentLab || null
            });

        } catch (error) {
            console.error('Error getting rekap nilai:', error);
            res.status(500).render('rekapNilai', {
                rekapNilai: [],
                namaMahasiswa: 'Mahasiswa',
                nilaiRataRata: 0,
                jumlahTugas: 0,
                currentPage: 'rekapNilai',
                currentLab: req.session.currentLab || null,
                error: 'Terjadi kesalahan saat mengambil data rekap nilai: ' + error.message
            });
        }
    },

    // Generate PDF dengan data terstruktur
    async generatePDF(req, res) {
        try {
            console.log('[PDF] Mulai generate PDF...');
            
            // Ambil user yang sedang login dari session
            let currentUser = req.session.user;
            
            // Jika tidak ada user yang login, gunakan user mahasiswa pertama sebagai default
            if (!currentUser) {
                console.log('[PDF] User tidak terautentikasi, mencari user mahasiswa default...');
                
                const defaultMahasiswa = await prisma.user.findFirst({
                    where: { peran: 'mahasiswa' }
                });
                
                if (defaultMahasiswa) {
                    currentUser = {
                        id: defaultMahasiswa.id,
                        username: defaultMahasiswa.username,
                        peran: defaultMahasiswa.peran
                    };
                    
                    // Set session untuk user ini
                    req.session.user = currentUser;
                    console.log('[PDF] Menggunakan user default:', currentUser.username);
                } else {
                    return res.status(404).json({
                        success: false,
                        message: 'Tidak ada data mahasiswa di database'
                    });
                }
            }

            // Pastikan user adalah mahasiswa
            if (currentUser.peran !== 'mahasiswa') {
                return res.status(403).json({
                    success: false,
                    message: 'Akses ditolak. Hanya mahasiswa yang dapat mengakses fitur ini.',
                    currentUser: currentUser.username,
                    userRole: currentUser.peran
                });
            }
            
            // Ambil data rekap nilai hanya untuk mahasiswa yang sedang login
            const rekapNilai = await prisma.pengumpulan.findMany({
                include: {
                    user: { 
                        select: { 
                            username: true, 
                            peran: true 
                        } 
                    },
                    tugas: { 
                        select: { 
                            judul: true 
                        } 
                    }
                },
                where: { 
                    user_id: currentUser.id
                },
                orderBy: [
                    { tugas: { judul: 'asc' } }
                ]
            });

            console.log('[PDF] Data rekapNilai:', rekapNilai.length);

            // Hitung nilai rata-rata keseluruhan untuk mahasiswa ini
            const nilaiValues = rekapNilai
                .filter(item => item.nilai !== null)
                .map(item => item.nilai);
            
            const nilaiRataRata = nilaiValues.length > 0 
                ? (nilaiValues.reduce((sum, nilai) => sum + nilai, 0) / nilaiValues.length).toFixed(2)
                : 0;

            const jumlahTugas = nilaiValues.length;

            console.log('[PDF] Nilai rata-rata:', nilaiRataRata);

            // Buat HTML untuk PDF
            let html = `
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px;
                            font-size: 12px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 20px;
                        }
                        .header h1 {
                            color: #333;
                            margin: 0;
                            font-size: 24px;
                        }
                        .header p {
                            color: #666;
                            margin: 5px 0;
                        }
                        .student-info {
                            margin-bottom: 30px;
                            padding: 15px;
                            background-color: #f8f9fa;
                            border-radius: 5px;
                            border-left: 4px solid #764ba2;
                        }
                        .student-info h3 {
                            margin: 0 0 10px 0;
                            color: #333;
                        }
                        .student-info-grid {
                            display: flex;
                            justify-content: space-between;
                        }
                        .student-info-item {
                            text-align: center;
                        }
                        .student-info-item strong {
                            display: block;
                            font-size: 18px;
                            color: #333;
                        }
                        .student-info-item span {
                            color: #666;
                            font-size: 12px;
                        }
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin-top: 20px; 
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 8px; 
                            text-align: left; 
                            font-size: 11px;
                        }
                        th { 
                            background: #764ba2; 
                            color: #fff; 
                            font-weight: bold;
                        }
                        tr:nth-child(even) { 
                            background: #f2f2f2; 
                        }
                        .nilai-cell {
                            text-align: center;
                            font-weight: bold;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 10px;
                            color: #666;
                            border-top: 1px solid #ddd;
                            padding-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>REKAP NILAI PRAKTIKUM</h1>
                        <p>Labcorner - Sistem Manajemen Praktikum</p>
                        <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>

                    <div class="student-info">
                        <h3>Informasi Mahasiswa</h3>
                        <div class="student-info-grid">
                            <div class="student-info-item">
                                <strong>${currentUser.username}</strong>
                                <span>Nama Mahasiswa</span>
                            </div>
                            <div class="student-info-item">
                                <strong>${rekapNilai.length}</strong>
                                <span>Total Tugas</span>
                            </div>
                            <div class="student-info-item">
                                <strong>${jumlahTugas}</strong>
                                <span>Tugas Dinilai</span>
                            </div>
                            <div class="student-info-item">
                                <strong>${nilaiRataRata}</strong>
                                <span>Nilai Rata-rata</span>
                            </div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 10%;">No</th>
                                <th style="width: 50%;">Judul Praktikum</th>
                                <th style="width: 15%;">Nilai</th>
                                <th style="width: 15%;">Waktu Pengumpulan</th>
                                <th style="width: 10%;">File</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            rekapNilai.forEach((item, index) => {
                const nilaiDisplay = item.nilai !== null ? item.nilai : '-';
                const waktuDisplay = item.waktu_kirim 
                    ? new Date(item.waktu_kirim).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : '-';
                const fileDisplay = item.file_path ? 'Ada' : '-';

                html += `
                    <tr>
                        <td style="text-align: center;">${index + 1}</td>
                        <td>${item.tugas.judul}</td>
                        <td class="nilai-cell">${nilaiDisplay}</td>
                        <td style="text-align: center;">${waktuDisplay}</td>
                        <td style="text-align: center;">${fileDisplay}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>Dokumen ini di-generate secara otomatis oleh sistem Labcorner</p>
                        <p>© ${new Date().getFullYear()} Labcorner - Sistem Manajemen Praktikum</p>
                    </div>
                </body>
                </html>
            `;

            console.log('[PDF] HTML siap, launching puppeteer...');
            
            // Generate PDF menggunakan Puppeteer
            const browser = await puppeteer.launch({ 
                headless: "new", 
                args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            console.log('[PDF] HTML loaded di puppeteer, generate PDF...');
            
            const pdfBuffer = await page.pdf({ 
                format: 'A4', 
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                }
            });
            
            await browser.close();
            console.log('[PDF] PDF berhasil dibuat, mengirim ke client...');
            
            // Set header untuk download PDF
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="rekap-nilai-${currentUser.username}-${new Date().toISOString().split('T')[0]}.pdf"`,
                'Content-Length': pdfBuffer.length
            });
            
            res.send(pdfBuffer);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat generate PDF',
                error: error.message
            });
        }
    }
};

module.exports = rekapNilaiController; 