const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testKodeAkses() {
    try {
        console.log('=== TEST KODE AKSES ===');
        
        // Test 1: Cek semua kode akses di database
        console.log('\n1. Kode akses yang tersedia:');
        const semuaPraktikum = await prisma.praktikum.findMany({
            select: {
                id: true,
                nama_praktikum: true,
                kode_masuk: true,
                lab: {
                    select: {
                        nama_lab: true
                    }
                }
            }
        });
        
        semuaPraktikum.forEach((praktikum, index) => {
            console.log(`${index + 1}. ${praktikum.nama_praktikum}`);
            console.log(`   Lab: ${praktikum.lab.nama_lab}`);
            console.log(`   Kode: "${praktikum.kode_masuk}"`);
            console.log(`   ID: ${praktikum.id}`);
            console.log('');
        });

        // Test 2: Test pencarian dengan kode yang ada
        console.log('\n2. Test pencarian kode akses:');
        const testKodes = ['pwebA2025', 'pwebB2025', 'gisA2025', 'gisB2025', 'ldkomA2025'];
        
        for (const kode of testKodes) {
            const praktikum = await prisma.praktikum.findUnique({
                where: { kode_masuk: kode },
                include: { lab: true }
            });
            
            if (praktikum) {
                console.log(`✓ Kode "${kode}" ditemukan: ${praktikum.nama_praktikum}`);
            } else {
                console.log(`✗ Kode "${kode}" TIDAK ditemukan`);
            }
        }

        // Test 3: Test kode yang tidak ada
        console.log('\n3. Test kode yang tidak ada:');
        const kodeTidakAda = await prisma.praktikum.findUnique({
            where: { kode_masuk: 'kode_tidak_ada' }
        });
        
        if (!kodeTidakAda) {
            console.log('✓ Kode "kode_tidak_ada" tidak ditemukan (sesuai harapan)');
        } else {
            console.log('✗ Kode "kode_tidak_ada" ditemukan (tidak sesuai harapan)');
        }

        // Test 4: Cek user mahasiswa
        console.log('\n4. User mahasiswa yang tersedia:');
        const mahasiswa = await prisma.user.findMany({
            where: { peran: 'mahasiswa' },
            select: { id: true, username: true }
        });
        
        mahasiswa.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username} (${user.id})`);
        });

        console.log('\n=== TEST SELESAI ===');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testKodeAkses(); 