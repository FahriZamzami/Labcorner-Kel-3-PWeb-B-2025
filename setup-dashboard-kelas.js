const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDashboardKelas() {
    try {
        console.log('=== SETUP DASHBOARD KELAS ===');
        
        // 1. Pastikan ada user mahasiswa
        console.log('\n1. Setup user mahasiswa...');
        const existingMahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });
        
        if (!existingMahasiswa) {
            const newMahasiswa = await prisma.user.create({
                data: {
                    id: 'mahasiswa001',
                    username: 'Fahri Zamzami',
                    password: 'password123', // Dalam implementasi nyata, gunakan bcrypt
                    peran: 'mahasiswa',
                    email: 'fahri@example.com'
                }
            });
            console.log('✅ User mahasiswa dibuat:', newMahasiswa.username);
        } else {
            console.log('✅ User mahasiswa sudah ada:', existingMahasiswa.username);
        }
        
        // 2. Pastikan ada lab
        console.log('\n2. Setup lab...');
        const labs = [
            { id: 1, nama_lab: 'Lab PWEB', deskripsi: 'Laboratorium Pemrograman Web' },
            { id: 2, nama_lab: 'Lab GIS', deskripsi: 'Laboratorium Sistem Informasi Geografis' },
            { id: 3, nama_lab: 'Lab LDKOM', deskripsi: 'Laboratorium Jaringan Komputer' }
        ];
        
        for (const lab of labs) {
            const existingLab = await prisma.lab.findUnique({
                where: { id: lab.id }
            });
            
            if (!existingLab) {
                await prisma.lab.create({
                    data: lab
                });
                console.log(`✅ Lab dibuat: ${lab.nama_lab}`);
            } else {
                console.log(`✅ Lab sudah ada: ${lab.nama_lab}`);
            }
        }
        
        // 3. Pastikan ada praktikum dengan kode akses
        console.log('\n3. Setup praktikum...');
        const praktikums = [
            {
                id: 1,
                nama_praktikum: 'Praktikum PWEB Kelas A 2025',
                lab_id: 1,
                kode_masuk: 'pwebA2025',
                dibuat_pada: new Date('2025-06-17 20:24:56.952')
            },
            {
                id: 2,
                nama_praktikum: 'Praktikum PWEB Kelas B 2025',
                lab_id: 1,
                kode_masuk: 'pwebB2025',
                dibuat_pada: new Date('2025-06-18 21:18:58.190')
            },
            {
                id: 3,
                nama_praktikum: 'Praktikum GIS Kelas A 2025',
                lab_id: 2,
                kode_masuk: 'gisA2025',
                dibuat_pada: new Date('2025-06-14 11:32:39.000')
            },
            {
                id: 4,
                nama_praktikum: 'Praktikum GIS Kelas B 2025',
                lab_id: 2,
                kode_masuk: 'gisB2025',
                dibuat_pada: new Date('2025-06-14 11:32:39.000')
            },
            {
                id: 5,
                nama_praktikum: 'Praktikum LDKOM Kelas A 2025',
                lab_id: 3,
                kode_masuk: 'ldkomA2025',
                dibuat_pada: new Date('2025-06-20 19:23:28.000')
            }
        ];
        
        for (const praktikum of praktikums) {
            const existingPraktikum = await prisma.praktikum.findUnique({
                where: { id: praktikum.id }
            });
            
            if (!existingPraktikum) {
                await prisma.praktikum.create({
                    data: praktikum
                });
                console.log(`✅ Praktikum dibuat: ${praktikum.nama_praktikum} (Kode: ${praktikum.kode_masuk})`);
            } else {
                console.log(`✅ Praktikum sudah ada: ${praktikum.nama_praktikum} (Kode: ${praktikum.kode_masuk})`);
            }
        }
        
        // 4. Buat beberapa pendaftaran untuk testing
        console.log('\n4. Setup pendaftaran testing...');
        const mahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });
        
        if (mahasiswa) {
            // Daftar ke 2 praktikum untuk testing
            const testPraktikums = [1, 3]; // PWEB A dan GIS A
            
            for (const praktikumId of testPraktikums) {
                const existingPendaftaran = await prisma.pendaftaran.findFirst({
                    where: {
                        user_id: mahasiswa.id,
                        praktikum_id: praktikumId
                    }
                });
                
                if (!existingPendaftaran) {
                    await prisma.pendaftaran.create({
                        data: {
                            user_id: mahasiswa.id,
                            praktikum_id: praktikumId,
                            waktu_daftar: new Date()
                        }
                    });
                    
                    const praktikum = await prisma.praktikum.findUnique({
                        where: { id: praktikumId }
                    });
                    console.log(`✅ Pendaftaran dibuat: ${praktikum.nama_praktikum}`);
                } else {
                    const praktikum = await prisma.praktikum.findUnique({
                        where: { id: praktikumId }
                    });
                    console.log(`✅ Pendaftaran sudah ada: ${praktikum.nama_praktikum}`);
                }
            }
        }
        
        console.log('\n✅ Setup dashboard kelas selesai!');
        console.log('\n📋 Informasi untuk testing:');
        console.log('- URL Login Mahasiswa: http://localhost:3000/login-mahasiswa-page');
        console.log('- URL Dashboard Kelas: http://localhost:3000/dashboard-kelas');
        console.log('- URL Test Login: http://localhost:3000/test-login');
        console.log('- Kode akses tersedia: pwebA2025, pwebB2025, gisA2025, gisB2025, ldkomA2025');
        
    } catch (error) {
        console.error('❌ Error setup dashboard kelas:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setupDashboardKelas(); 