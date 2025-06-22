// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Memulai proses seeding...\n');

  // --- HASH PASSWORD ---
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordAsisten = await bcrypt.hash('asisten123', 10);
  const hashedPasswordMhs = await bcrypt.hash('mahasiswa123', 10);

  // --- DATA LAB ---
  console.log('🧪 Menyiapkan data Lab...');
  const labs = [
    { nama_lab: 'Lab. Enterprise Application' },
    { nama_lab: 'Lab. GIS & Mapping' },
    { nama_lab: 'Lab. Business Intelligence' },
    { nama_lab: 'Lab. Dasar Komputasi' }
  ];

  for (const lab of labs) {
    await prisma.lab.upsert({
      where: { nama_lab: lab.nama_lab },
      update: {},
      create: lab,
    });
  }
  console.log('✅ Data Lab berhasil di-seed.\n');

  // --- DATA USER ---
  console.log('👥 Menyiapkan data User...');
  const users = [
    {
      fullName: 'Admin Utama',
      username: 'admin',
      kata_sandi: hashedPasswordAdmin,
      peran: 'admin'
    },
    {
      fullName: 'Aufa Zikri Lubis',
      username: 'aufa123',
      kata_sandi: hashedPasswordAsisten,
      peran: 'asisten',
      labNama: 'Lab. Enterprise Application'
    },
    {
      fullName: 'Nabil Fajrul Hakim',
      username: 'nabil456',
      kata_sandi: hashedPasswordAsisten,
      peran: 'asisten',
      labNama: 'Lab. GIS & Mapping'
    },
    {
      fullName: 'Budi Santoso',
      username: 'budi.san',
      kata_sandi: hashedPasswordMhs,
      peran: 'mahasiswa'
    },
    {
      fullName: 'Citra Lestari',
      username: 'citra.l',
      kata_sandi: hashedPasswordMhs,
      peran: 'mahasiswa'
    }
  ];

  const validPeran = ['admin', 'asisten', 'mahasiswa'];

  for (const userData of users) {
    const { labNama, ...userFields } = userData;

    // Validasi peran
    if (!validPeran.includes(userFields.peran)) {
      console.warn(`⚠️  Peran tidak valid: ${userFields.peran}`);
      continue;
    }

    // Upsert User
    const createdUser = await prisma.user.upsert({
      where: { username: userFields.username },
      update: {},
      create: {
        id: userFields.username, // menggunakan username sebagai id
        ...userFields
      }
    });

    // Hubungkan dengan Lab jika Asisten
    if (userFields.peran === 'asisten' && labNama) {
      const lab = await prisma.lab.findUnique({
        where: { nama_lab: labNama }
      });

      if (lab) {
        await prisma.asistenLab.upsert({
          where: {
            user_id_lab_id: {
              user_id: createdUser.id,
              lab_id: lab.id
            }
          },
          update: {},
          create: {
            user_id: createdUser.id,
            lab_id: lab.id
          }
        });
        console.log(`🔗 ${createdUser.fullName} terhubung dengan ${lab.nama_lab}`);
      } else {
        console.warn(`⚠️  Lab '${labNama}' tidak ditemukan.`);
      }
    }
  }

  console.log('\n✅ Data User dan relasi AsistenLab berhasil di-seed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🏁 Seeding selesai dengan sukses!');
  })
  .catch(async (e) => {
    console.error('\n❌ Terjadi error saat seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
