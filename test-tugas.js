const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTugas() {
  try {
    console.log('Testing database connection...');
    
    // Test koneksi database
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    // Cari semua tugas
    const allTugas = await prisma.tugas.findMany();
    console.log(`\nTotal tugas di database: ${allTugas.length}`);
    
    allTugas.forEach(tugas => {
      console.log(`ID: ${tugas.id}, Judul: ${tugas.judul}, Status: ${tugas.status}`);
    });
    
    // Cari tugas dengan ID 7
    const tugas7 = await prisma.tugas.findUnique({
      where: { id: 7 }
    });
    
    if (tugas7) {
      console.log(`\nTugas dengan ID 7 ditemukan:`);
      console.log(`Judul: ${tugas7.judul}`);
      console.log(`Deskripsi: ${tugas7.deskripsi}`);
      console.log(`Status: ${tugas7.status}`);
      console.log(`Batas Waktu: ${tugas7.batas_waktu}`);
    } else {
      console.log('\nTugas dengan ID 7 TIDAK ditemukan!');
    }
    
    // Cari user dengan ID 'user1'
    const user1 = await prisma.user.findUnique({
      where: { id: 'user1' }
    });
    
    if (user1) {
      console.log(`\nUser dengan ID 'user1' ditemukan:`);
      console.log(`Username: ${user1.username}`);
      console.log(`Peran: ${user1.peran}`);
    } else {
      console.log('\nUser dengan ID "user1" TIDAK ditemukan!');
      
      // Cari semua user yang ada
      const allUsers = await prisma.user.findMany();
      console.log(`\nTotal user di database: ${allUsers.length}`);
      allUsers.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}, Peran: ${user.peran}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTugas(); 