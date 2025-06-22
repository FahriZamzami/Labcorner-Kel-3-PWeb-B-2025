const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAnnouncement() {
  console.log('🧪 Testing announcement creation...');
  
  try {
    const announcement = await prisma.pengumuman.create({
      data: {
        isi: 'Test pengumuman dari script - ' + new Date().toLocaleString(),
        praktikum_id: 6,
        dibuat_oleh: 'adm001'
      }
    });
    
    console.log('✅ Announcement created:', announcement);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAnnouncement(); 