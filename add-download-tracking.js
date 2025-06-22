const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addDownloadTracking() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    // Get first praktikum
    const praktikum = await prisma.praktikum.findFirst();
    if (!praktikum) {
      console.log('No praktikum found');
      return;
    }
    console.log('Using praktikum:', praktikum.nama_praktikum);

    // Get first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found');
      return;
    }
    console.log('Using user:', user.username);

    // Get first modul
    const modul = await prisma.modul.findFirst({
      where: { praktikum_id: praktikum.id }
    });
    if (!modul) {
      console.log('No modul found');
      return;
    }
    console.log('Using modul:', modul.judul);

    // Add some download tracking data
    const downloadData = [
      {
        modul_id: modul.id,
        user_id: user.id,
        praktikum_id: praktikum.id,
        downloaded_at: new Date()
      },
      {
        modul_id: modul.id,
        user_id: user.id,
        praktikum_id: praktikum.id,
        downloaded_at: new Date()
      }
    ];

    for (const data of downloadData) {
      await prisma.downloadTracking.create({
        data: data
      });
      console.log('Added download tracking for modul:', modul.judul);
    }

    // Check total downloads
    const uniqueDownloads = await prisma.downloadTracking.groupBy({
      by: ['modul_id'],
      where: {
        praktikum_id: praktikum.id
      }
    });
    console.log('Total unique downloads:', uniqueDownloads.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDownloadTracking(); 