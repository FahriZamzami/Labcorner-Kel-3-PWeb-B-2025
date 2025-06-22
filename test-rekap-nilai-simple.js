const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRekapNilai() {
    try {
        console.log('=== TESTING REKAP NILAI ===\n');

        // Test 1: Cek user mahasiswa
        const users = await prisma.user.findMany({
            where: { peran: 'mahasiswa' },
            select: { id: true, username: true, peran: true }
        });
        console.log('1. Users (mahasiswa):', users.length);
        console.log(users);
        console.log('');

        // Test 2: Cek tugas
        const tugas = await prisma.tugas.findMany({
            select: { id: true, judul: true }
        });
        console.log('2. Tugas:', tugas.length);
        console.log(tugas);
        console.log('');

        // Test 3: Cek pengumpulan dengan file_path
        const pengumpulan = await prisma.pengumpulan.findMany({
            include: {
                user: { select: { username: true, peran: true } },
                tugas: { select: { judul: true } }
            }
        });
        console.log('3. Pengumpulan:', pengumpulan.length);
        console.log('Sample data:', pengumpulan.slice(0, 2));
        console.log('');

        // Test 4: Cek pengumpulan mahasiswa dengan file
        const pengumpulanMahasiswa = await prisma.pengumpulan.findMany({
            include: {
                user: { select: { username: true, peran: true } },
                tugas: { select: { judul: true } }
            },
            where: {
                user: { peran: 'mahasiswa' },
                file_path: { not: null }
            }
        });
        console.log('4. Pengumpulan Mahasiswa dengan file:', pengumpulanMahasiswa.length);
        console.log('Sample data:', pengumpulanMahasiswa.slice(0, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testRekapNilai(); 