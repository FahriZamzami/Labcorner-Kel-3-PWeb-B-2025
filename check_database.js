const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Mengecek koneksi database...');
    
    // Test koneksi
    await prisma.$connect();
    console.log('✅ Database terhubung!');
    
    // Cek tabel lab
    console.log('\n🏢 Mengecek tabel lab...');
    const labs = await prisma.lab.findMany();
    console.log(`📊 Total lab: ${labs.length}`);
    labs.forEach(lab => {
      console.log(`  - ID: ${lab.id} - ${lab.nama_lab} - ${lab.dosen || 'Dosen TBD'} - Status: ${lab.status}`);
      console.log(`    Deskripsi: ${lab.deskripsi || 'Deskripsi TBD'}`);
      console.log(`    Jadwal: ${lab.jadwal || 'Jadwal TBD'}`);
    });
    
    // Cek tabel user
    console.log('\n👥 Mengecek tabel user...');
    const users = await prisma.user.findMany();
    console.log(`📊 Total user: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.peran}) - ID: ${user.id}`);
    });
    
    // Cek tabel asisten lab
    console.log('\n👨‍🏫 Mengecek tabel asisten lab...');
    const asistenLabs = await prisma.asistenLab.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            username: true
          }
        },
        lab: {
          select: {
            nama_lab: true
          }
        }
      }
    });
    console.log(`📊 Total asisten lab: ${asistenLabs.length}`);
    asistenLabs.forEach(asisten => {
      console.log(`  - ${asisten.user.fullName || asisten.user.username} di ${asisten.lab.nama_lab}`);
    });
    
    // Cek tabel pengumuman
    console.log('\n📢 Mengecek tabel pengumuman...');
    const announcements = await prisma.pengumuman.findMany();
    console.log(`📊 Total pengumuman: ${announcements.length}`);
    announcements.forEach(ann => {
      console.log(`  - ID: ${ann.id} - Praktikum ID: ${ann.praktikum_id} - Dibuat oleh: ${ann.dibuat_oleh}`);
      console.log(`    Isi: ${ann.isi.substring(0, 50)}...`);
    });
    
    // Cek tabel praktikum
    console.log('\n🔬 Mengecek tabel praktikum...');
    const praktikums = await prisma.praktikum.findMany({
      include: {
        lab: {
          select: {
            nama_lab: true
          }
        }
      }
    });
    console.log(`📊 Total praktikum: ${praktikums.length}`);
    praktikums.forEach(prak => {
      console.log(`  - ID: ${prak.id} - ${prak.nama_praktikum} (Lab: ${prak.lab.nama_lab})`);
    });
    
    // Cek tabel mahasiswa
    console.log('\n🎓 Mengecek tabel mahasiswa...');
    const mahasiswas = await prisma.mahasiswa.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            username: true
          }
        },
        praktikum: {
          include: {
            lab: {
              select: {
                nama_lab: true
              }
            }
          }
        }
      }
    });
    console.log(`📊 Total mahasiswa: ${mahasiswas.length}`);
    mahasiswas.forEach(mhs => {
      console.log(`  - ${mhs.user.fullName || mhs.user.username} di ${mhs.praktikum.lab.nama_lab}`);
    });
    
    // Cek apakah user admin ada
    const adminUser = await prisma.user.findUnique({
      where: { id: 'adm001' }
    });
    
    if (adminUser) {
      console.log('\n✅ User admin ditemukan!');
      console.log(`  - Username: ${adminUser.username}`);
      console.log(`  - Peran: ${adminUser.peran}`);
      console.log(`  - ID: ${adminUser.id}`);
    } else {
      console.log('\n❌ User admin TIDAK ditemukan!');
    }
    
    console.log('\n✅ Pengecekan selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

checkDatabase(); 