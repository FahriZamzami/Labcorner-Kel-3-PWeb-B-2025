const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('--- Checking Users ---');
    console.log('Attempting to fetch users...');
    const users = await prisma.user.findMany({
      take: 20, // Limit to 20 users for brevity
    });
    console.log('...users fetched.');
    console.table(users);

    console.log('\n--- Checking Lab Assistants (AsistenLab) ---');
    console.log('Attempting to fetch assistants...');
    const asisten = await prisma.asistenLab.findMany({
      take: 20,
      include: {
        user: true,
        lab: true,
      },
    });
    console.log('...assistants fetched.');
    // Format for console.table
    const asistenTable = asisten.map(a => ({
      asisten_id: a.id,
      user_id: a.user_id,
      user_name: a.user ? a.user.fullName : 'N/A (user deleted)',
      lab_id: a.lab_id,
      lab_name: a.lab ? a.lab.nama_lab : 'N/A (lab deleted)',
    }));
    console.table(asistenTable);

    console.log('\n--- Checking Students (Mahasiswa) ---');
    console.log('Attempting to fetch students...');
    const mahasiswa = await prisma.mahasiswa.findMany({
      take: 20,
      include: {
        user: true,
        praktikum: {
          include: {
            lab: true
          }
        }
      },
    });
    console.log('...students fetched.');
    // Format for console.table
    const mahasiswaTable = mahasiswa.map(m => ({
      mahasiswa_id: m.id,
      user_id: m.user_id,
      user_name: m.user ? m.user.fullName : 'N/A (user deleted)',
      praktikum_id: m.praktikum_id,
      lab_name: m.praktikum && m.praktikum.lab ? m.praktikum.lab.nama_lab : 'N/A (praktikum/lab deleted)'
    }));
    console.table(mahasiswaTable);

  } catch (error) {
    console.error('Error checking database content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 