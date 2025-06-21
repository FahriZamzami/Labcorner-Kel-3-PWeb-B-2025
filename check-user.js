const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    await prisma.$connect();
    console.log('Database connected!');
    
    // Cari user dengan ID 'user1'
    const user = await prisma.user.findUnique({
      where: { id: 'user1' }
    });
    
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User with ID "user1" not found!');
      
      // Cari semua user yang ada
      const allUsers = await prisma.user.findMany();
      console.log('All users in database:');
      allUsers.forEach(u => console.log(`- ID: ${u.id}, Username: ${u.username}`));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser(); 