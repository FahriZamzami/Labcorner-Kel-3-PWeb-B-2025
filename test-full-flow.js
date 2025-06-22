const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFullFlow() {
    try {
        console.log('=== TEST FULL FLOW: LOGIN → DASHBOARD → JOIN CLASS ===');
        
        // Test 1: Cek user mahasiswa
        console.log('\n1. Cek user mahasiswa:');
        const mahasiswa = await prisma.user.findFirst({
            where: { peran: 'mahasiswa' }
        });
        
        if (!mahasiswa) {
            console.log('❌ Tidak ada user mahasiswa');
            return;
        }
        
        console.log('✅ User mahasiswa ditemukan:', {
            id: mahasiswa.id,
            username: mahasiswa.username,
            peran: mahasiswa.peran
        });
        
        // Test 2: Cek kode akses
        console.log('\n2. Cek kode akses praktikum:');
        const kodeAkses = 'pwebA2025';
        const praktikum = await prisma.praktikum.findUnique({
            where: { kode_masuk: kodeAkses },
            include: { lab: true }
        });
        
        if (!praktikum) {
            console.log('❌ Kode akses tidak valid:', kodeAkses);
            return;
        }
        
        console.log('✅ Kode akses valid:', {
            id: praktikum.id,
            nama_praktikum: praktikum.nama_praktikum,
            kode_masuk: praktikum.kode_masuk,
            lab: praktikum.lab.nama_lab
        });
        
        // Test 3: Cek apakah sudah terdaftar
        console.log('\n3. Cek pendaftaran existing:');
        const existingPendaftaran = await prisma.pendaftaran.findFirst({
            where: {
                user_id: mahasiswa.id,
                praktikum_id: praktikum.id
            }
        });
        
        if (existingPendaftaran) {
            console.log('⚠️ User sudah terdaftar di kelas ini');
            console.log('Pendaftaran:', {
                id: existingPendaftaran.id,
                user_id: existingPendaftaran.user_id,
                praktikum_id: existingPendaftaran.praktikum_id,
                waktu_daftar: existingPendaftaran.waktu_daftar
            });
        } else {
            console.log('✅ User belum terdaftar, bisa join kelas');
        }
        
        // Test 4: Simulasi pendaftaran (jika belum terdaftar)
        if (!existingPendaftaran) {
            console.log('\n4. Simulasi pendaftaran baru:');
            try {
                const newPendaftaran = await prisma.pendaftaran.create({
                    data: {
                        user_id: mahasiswa.id,
                        praktikum_id: praktikum.id,
                        waktu_daftar: new Date()
                    }
                });
                
                console.log('✅ Pendaftaran berhasil:', {
                    id: newPendaftaran.id,
                    user_id: newPendaftaran.user_id,
                    praktikum_id: newPendaftaran.praktikum_id,
                    waktu_daftar: newPendaftaran.waktu_daftar
                });
                
                // Cleanup: hapus pendaftaran test
                await prisma.pendaftaran.delete({
                    where: { id: newPendaftaran.id }
                });
                console.log('✅ Test pendaftaran dihapus (cleanup)');
                
            } catch (error) {
                console.log('❌ Error saat pendaftaran:', error.message);
            }
        }
        
        // Test 5: Cek semua pendaftaran user
        console.log('\n5. Semua pendaftaran user:');
        const semuaPendaftaran = await prisma.pendaftaran.findMany({
            where: { user_id: mahasiswa.id },
            include: {
                praktikum: {
                    include: { lab: true }
                }
            }
        });
        
        console.log(`Total pendaftaran: ${semuaPendaftaran.length}`);
        semuaPendaftaran.forEach((pendaftaran, index) => {
            console.log(`${index + 1}. ${pendaftaran.praktikum.nama_praktikum} (${pendaftaran.praktikum.lab.nama_lab})`);
        });
        
        console.log('\n✅ Test full flow selesai!');
        
    } catch (error) {
        console.error('❌ Error in test full flow:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testFullFlow(); 