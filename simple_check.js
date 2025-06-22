const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
  console.log('🔍 Checking database...');
  
  try {
    // Check users
    const users = await prisma.user.findMany();
    console.log(`Users: ${users.length}`);
    
    // Check labs
    const labs = await prisma.lab.findMany();
    console.log(`Labs: ${labs.length}`);
    
    // Check praktikum
    const praktikums = await prisma.praktikum.findMany();
    console.log(`Praktikums: ${praktikums.length}`);
    
    // Check pengumuman
    const announcements = await prisma.pengumuman.findMany();
    console.log(`Announcements: ${announcements.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check(); 