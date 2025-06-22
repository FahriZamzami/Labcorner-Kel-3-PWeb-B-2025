const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPengumumanSchema() {
  console.log('🔍 Checking pengumuman table structure...');
  
  try {
    // Try to get the table structure by attempting a query
    const result = await prisma.$queryRaw`DESCRIBE pengumuman`;
    console.log('📋 Table structure:', result);
    
    // Also try to count records
    const count = await prisma.pengumuman.count();
    console.log('📊 Total pengumuman records:', count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error meta:', error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

checkPengumumanSchema(); 