const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDummyAnnouncements() {
  console.log('🚀 Script dimulai...');
  
  try {
    console.log('🚀 Menambahkan data dummy pengumuman...');
    
    // Test koneksi
    await prisma.$connect();
    console.log('✅ Database terhubung!');
    
    // Cek apakah user admin ada
    console.log('🔍 Mencari user admin...');
    const adminUser = await prisma.user.findUnique({
      where: { id: 'adm001' }
    });
    
    if (!adminUser) {
      console.error('❌ User admin tidak ditemukan!');
      return;
    }
    
    console.log('✅ User admin ditemukan:', adminUser.username);
    
    // Tambah pengumuman dummy
    const announcements = [
      {
        isi: 'Jadwal Maintenance Server: Server akan maintenance pada hari Jumat, 21 Juni 2024 pukul 22:00 WIB. Mohon simpan pekerjaan Anda sebelum waktu tersebut.',
        praktikum_id: 1, // ID praktikum yang ada
        dibuat_oleh: 'adm001'
      },
      {
        isi: 'Praktikum LBI Diperpanjang: Deadline pengumpulan tugas LBI diperpanjang hingga 25 Juni 2024.',
        praktikum_id: 1, // ID praktikum yang ada
        dibuat_oleh: 'adm001'
      },
      {
        isi: 'Praktikum LEA Minggu Depan: Praktikum LEA minggu depan akan membahas Spring Boot dan REST API.',
        praktikum_id: 1, // ID praktikum yang ada
        dibuat_oleh: 'adm001'
      }
    ];
    
    console.log(`📝 Akan menambahkan ${announcements.length} pengumuman...`);
    
    for (let i = 0; i < announcements.length; i++) {
      const announcement = announcements[i];
      console.log(`\n📢 Menambahkan pengumuman ${i + 1}/${announcements.length}: ${announcement.isi}`);
      
      try {
        const created = await prisma.pengumuman.create({
          data: announcement
        });
        console.log(`✅ Pengumuman berhasil ditambahkan dengan ID: ${created.id}`);
      } catch (createError) {
        console.error(`❌ Gagal menambahkan pengumuman: ${announcement.isi}`);
        console.error('Error:', createError.message);
        if (createError.meta) {
          console.error('Prisma meta:', createError.meta);
        }
      }
    }
    
    console.log('\n🎉 Proses penambahan pengumuman selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

console.log('📜 Script loaded, calling function...');
addDummyAnnouncements(); 