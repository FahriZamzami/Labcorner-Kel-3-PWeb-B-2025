const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLabs() {
  console.log('🔍 Checking labs table...');
  
  try {
    const labs = await prisma.lab.findMany();
    
    console.log('🏢 Labs found:', labs.length);
    labs.forEach(lab => {
      console.log(`- ID: ${lab.id}, Nama: ${lab.nama_lab}, Status: ${lab.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLabs(); 