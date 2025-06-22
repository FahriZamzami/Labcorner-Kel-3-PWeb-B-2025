const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addPraktikum() {
  console.log('🚀 Adding praktikum...');
  
  try {
    // Get the first lab
    const lab = await prisma.lab.findFirst();
    
    if (!lab) {
      console.error('❌ No labs found!');
      return;
    }
    
    console.log(`📋 Using lab: ${lab.nama_lab} (ID: ${lab.id})`);
    
    const praktikum = await prisma.praktikum.create({
      data: {
        nama_praktikum: 'Praktikum Umum',
        kode_masuk: 'UMUM2024',
        lab_id: lab.id
      }
    });
    
    console.log('✅ Praktikum created:', praktikum);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPraktikum(); 