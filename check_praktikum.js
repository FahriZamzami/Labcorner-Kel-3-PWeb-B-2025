const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPraktikum() {
  console.log('🔍 Checking praktikum table...');
  
  try {
    const praktikum = await prisma.praktikum.findMany({
      include: {
        lab: true
      }
    });
    
    console.log('📋 Praktikum found:', praktikum.length);
    praktikum.forEach(p => {
      console.log(`- ID: ${p.id}, Nama: ${p.nama_praktikum}, Lab: ${p.lab?.nama_lab}, Kode: ${p.kode_masuk}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPraktikum(); 