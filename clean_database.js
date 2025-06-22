const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Memulai proses pembersihan database...');
  try {
    // Hapus semua pengumuman
    const deletedPengumuman = await prisma.pengumuman.deleteMany({});
    console.log(`- ✅ Berhasil menghapus ${deletedPengumuman.count} data pengumuman.`);

    // Hapus semua praktikum
    const deletedPraktikum = await prisma.praktikum.deleteMany({});
    console.log(`- ✅ Berhasil menghapus ${deletedPraktikum.count} data praktikum.`);

    // Hapus semua mahasiswa
    const deletedMahasiswa = await prisma.mahasiswa.deleteMany({});
    console.log(`- ✅ Berhasil menghapus ${deletedMahasiswa.count} data mahasiswa.`);

    // Hapus semua asisten lab
    const deletedAsisten = await prisma.asistenLab.deleteMany({});
    console.log(`- ✅ Berhasil menghapus ${deletedAsisten.count} data asisten lab.`);
    
    // Anda bisa tambahkan model lain yang ingin dibersihkan di sini
    // contoh: const deletedPraktikum = await prisma.praktikum.deleteMany({});

    console.log('✨ Database berhasil dibersihkan dari data dummy/transaksional. Data User dan Lab tetap aman.');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat membersihkan database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Koneksi database ditutup.');
  }
}

cleanDatabase(); 