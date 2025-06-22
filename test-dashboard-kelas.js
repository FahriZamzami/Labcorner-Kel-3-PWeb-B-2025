const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboardKelas() {
    try {
        console.log('=== TEST DASHBOARD KELAS ===');
        
        // Test 1: Ambil semua praktikum
        console.log('\n1. Mengambil semua praktikum:');
        const semuaPraktikum = await prisma.praktikum.findMany({
            include: {
                lab: true
            },
            orderBy: {
                nama_praktikum: 'asc'
            }
        });
        
        console.log(`Total praktikum: ${semuaPraktikum.length}`);
        semuaPraktikum.forEach((praktikum, index) => {
            console.log(`${index + 1}. ${praktikum.nama_praktikum}`);
            console.log(`   Lab: ${praktikum.lab.nama_lab}`);
            console.log(`   Kode Masuk: ${praktikum.kode_masuk}`);
            console.log(`   ID: ${praktikum.id}`);
            console.log('');
        });

        // Test 2: Ambil user mahasiswa
        console.log('\n2. Mengambil user mahasiswa:');
        const mahasiswa = await prisma.user.findMany({
            where: {
                peran: 'mahasiswa'
            },
            take: 3
        });
        
        console.log(`Total mahasiswa: ${mahasiswa.length}`);
        mahasiswa.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.id})`);
        });

        // Test 3: Cek pendaftaran mahasiswa
        if (mahasiswa.length > 0) {
            console.log('\n3. Cek pendaftaran mahasiswa pertama:');
            const pendaftaran = await prisma.pendaftaran.findMany({
                where: {
                    user_id: mahasiswa[0].id
                },
                include: {
                    praktikum: {
                        include: {
                            lab: true
                        }
                    }
                }
            });
            
            console.log(`Pendaftaran untuk ${mahasiswa[0].username}: ${pendaftaran.length}`);
            pendaftaran.forEach((daftar, index) => {
                console.log(`${index + 1}. ${daftar.praktikum.nama_praktikum} (${daftar.praktikum.lab.nama_lab})`);
            });
        }

        // Test 4: Test kode masuk
        console.log('\n4. Test kode masuk:');
        const testKode = 'pwebA2025';
        const praktikumByKode = await prisma.praktikum.findUnique({
            where: {
                kode_masuk: testKode
            },
            include: {
                lab: true
            }
        });
        
        if (praktikumByKode) {
            console.log(`Kode ${testKode} ditemukan: ${praktikumByKode.nama_praktikum}`);
        } else {
            console.log(`Kode ${testKode} tidak ditemukan`);
        }

        console.log('\n=== TEST SELESAI ===');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDashboardKelas(); 