const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSession() {
    try {
        console.log('=== TEST SESSION & USER ===');
        
        // Test 1: Cek semua user mahasiswa
        console.log('\n1. Semua user mahasiswa:');
        const mahasiswaUsers = await prisma.user.findMany({
            where: { peran: 'mahasiswa' },
            select: {
                id: true,
                username: true,
                peran: true
            }
        });
        
        console.log(`Total mahasiswa: ${mahasiswaUsers.length}`);
        mahasiswaUsers.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}, Username: "${user.username}", Peran: ${user.peran}`);
        });
        
        // Test 2: Cek format session yang diharapkan
        console.log('\n2. Format session yang diharapkan:');
        if (mahasiswaUsers.length > 0) {
            const sampleUser = mahasiswaUsers[0];
            const expectedSession = {
                id: sampleUser.id,
                username: sampleUser.username,
                peran: sampleUser.peran
            };
            console.log('Expected session format:', JSON.stringify(expectedSession, null, 2));
        }
        
        // Test 3: Cek kode akses praktikum
        console.log('\n3. Kode akses praktikum:');
        const praktikumList = await prisma.praktikum.findMany({
            select: {
                id: true,
                nama_praktikum: true,
                kode_masuk: true
            }
        });
        
        praktikumList.forEach((praktikum, index) => {
            console.log(`${index + 1}. ${praktikum.nama_praktikum} - Kode: "${praktikum.kode_masuk}"`);
        });
        
        // Test 4: Simulasi validasi kode akses
        console.log('\n4. Test validasi kode akses:');
        const testKode = 'pwebA2025';
        const praktikum = await prisma.praktikum.findUnique({
            where: { kode_masuk: testKode },
            include: { lab: true }
        });
        
        if (praktikum) {
            console.log(`✓ Kode "${testKode}" valid untuk: ${praktikum.nama_praktikum}`);
        } else {
            console.log(`✗ Kode "${testKode}" tidak ditemukan`);
        }
        
    } catch (error) {
        console.error('Error in test session:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSession(); 