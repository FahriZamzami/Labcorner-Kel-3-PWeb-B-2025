const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupUser() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    // Cek apakah user dengan ID 'user1' sudah ada
    let user = await prisma.user.findUnique({
      where: { id: 'user1' }
    });
    
    if (!user) {
      console.log('Creating user with ID "user1"...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      user = await prisma.user.create({
        data: {
          id: 'user1',
          username: 'user1',
          kata_sandi: hashedPassword,
          peran: 'mahasiswa'
        }
      });
      console.log('User created:', user.username);
    } else {
      console.log('User already exists:', user.username);
    }
    
    // Cek tugas dengan ID 7
    const tugas = await prisma.tugas.findUnique({
      where: { id: 7 }
    });
    
    if (tugas) {
      console.log('Tugas found:', tugas.judul);
    } else {
      console.log('Tugas with ID 7 not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUser(); 