const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLogin() {
    try {
        console.log('=== TESTING LOGIN SYSTEM ===\n');

        // Test 1: Cek semua user
        const allUsers = await prisma.user.findMany({
            select: { id: true, username: true, peran: true, kata_sandi: true }
        });
        console.log('1. Semua User:', allUsers.length);
        console.log(allUsers);
        console.log('');

        // Test 2: Cek user mahasiswa
        const mahasiswaUsers = await prisma.user.findMany({
            where: { peran: 'mahasiswa' },
            select: { id: true, username: true, peran: true, kata_sandi: true }
        });
        console.log('2. User Mahasiswa:', mahasiswaUsers.length);
        console.log(mahasiswaUsers);
        console.log('');

        // Test 3: Cek apakah ada pengumpulan untuk mahasiswa
        if (mahasiswaUsers.length > 0) {
            const firstMahasiswa = mahasiswaUsers[0];
            console.log('3. Testing dengan mahasiswa pertama:', firstMahasiswa.username);
            
            const pengumpulan = await prisma.pengumpulan.findMany({
                where: { user_id: firstMahasiswa.id },
                include: {
                    user: { select: { username: true, peran: true } },
                    tugas: { select: { judul: true } }
                }
            });
            console.log('Pengumpulan untuk mahasiswa ini:', pengumpulan.length);
            console.log(pengumpulan);
        }

        // Test 4: Cek data tugas
        const tugas = await prisma.tugas.findMany({
            select: { id: true, judul: true }
        });
        console.log('\n4. Data Tugas:', tugas.length);
        console.log(tugas);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin(); 