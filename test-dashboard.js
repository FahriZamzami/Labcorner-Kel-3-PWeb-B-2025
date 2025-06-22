const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboard() {
  try {
    await prisma.$connect();
    console.log('Testing dashboard functionality...');
    
    // Test query untuk dashboard
    const praktikum = await prisma.praktikum.findFirst();
    if (!praktikum) {
      console.log('❌ Tidak ada praktikum di database');
      return;
    }
    
    console.log(`✅ Praktikum ditemukan: ${praktikum.nama_praktikum}`);
    
    // Test query jumlah mahasiswa
    const jumlahMahasiswa = await prisma.pendaftaran.count({
      where: { praktikum_id: praktikum.id }
    });
    console.log(`✅ Jumlah mahasiswa: ${jumlahMahasiswa}`);
    
    // Test query jumlah modul
    const jumlahModul = await prisma.modul.count({
      where: { praktikum_id: praktikum.id }
    });
    console.log(`✅ Jumlah modul: ${jumlahModul}`);
    
    // Test query jadwal
    const jumlahJadwal = await prisma.jadwal.count({
      where: { praktikum_id: praktikum.id }
    });
    console.log(`✅ Jumlah jadwal: ${jumlahJadwal}`);
    
    // Test query daftar modul
    const daftarModul = await prisma.modul.findMany({
      where: { praktikum_id: praktikum.id },
      take: 3
    });
    console.log(`✅ Modul terbaru: ${daftarModul.length} modul`);
    
    // Test query daftar mahasiswa
    const daftarMahasiswa = await prisma.pendaftaran.findMany({
      where: { praktikum_id: praktikum.id },
      take: 3
    });
    console.log(`✅ Mahasiswa terbaru: ${daftarMahasiswa.length} mahasiswa`);
    
    console.log('\n🎉 Semua query dashboard berfungsi dengan baik!');
    
  } catch (error) {
    console.error('❌ Error testing dashboard:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboard(); 