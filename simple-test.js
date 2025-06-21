const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    const users = await prisma.user.findMany();
    console.log('Users:', users.map(u => ({ id: u.id, username: u.username })));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test(); 