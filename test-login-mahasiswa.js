const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLoginMahasiswa() {
    try {
        console.log('=== TEST LOGIN MAHASISWA ===');

        // 1. Cek user mahasiswa
        const mahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });

        if (!mahasiswa) {
            console.log('❌ Tidak ada user mahasiswa');
            return;
        }

        console.log('✅ Mahasiswa found:', mahasiswa.username);
        console.log('✅ User ID:', mahasiswa.id);
        console.log('✅ Peran:', mahasiswa.peran);

        console.log('\n=== TEST COMPLETE ===');
        console.log('🌐 Halaman login mahasiswa: http://localhost:3000/login-mahasiswa-page');
        console.log('🔑 Login cepat (demo): http://localhost:3000/login-mahasiswa');
        console.log('📊 Dashboard kelas: http://localhost:3000/dashboardKelas');

        console.log('\n📝 Test Credentials:');
        console.log(`Username: ${mahasiswa.username}`);
        console.log('Password: (any password for demo)');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testLoginMahasiswa(); 