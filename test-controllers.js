const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testControllers() {
  try {
    await prisma.$connect();
    console.log('Testing database connection...');
    
    // Test query untuk pilihLab controller
    const daftarLab = await prisma.praktikum.findMany({
      select: {
        id: true,
        nama_praktikum: true,
        lab_id: true,
      },
      orderBy: {
        nama_praktikum: 'asc'
      }
    });
    console.log('PilihLab Controller - Daftar lab:', daftarLab.length, 'praktikum ditemukan');
    
    // Test query untuk tugas controller
    const daftarTugas = await prisma.tugas.findMany({
      orderBy: {
        batas_waktu: 'asc'
      }
    });
    console.log('Tugas Controller - Daftar tugas:', daftarTugas.length, 'tugas ditemukan');
    
    // Test query untuk user
    const users = await prisma.user.findMany();
    console.log('User data:', users.length, 'user ditemukan');
    
    console.log('\n✅ Semua controller siap digunakan!');
    
  } catch (error) {
    console.error('❌ Error testing controllers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testControllers(); 