const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser() {
  try {
    await prisma.$connect();
    console.log('Database connected!');
    
    // Cek apakah user dengan ID 'user1' sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { id: 'user1' }
    });
    
    if (existingUser) {
      console.log('User with ID "user1" already exists:', existingUser.username);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        id: 'user1',
        username: 'user1',
        kata_sandi: hashedPassword,
        peran: 'mahasiswa'
      }
    });
    
    console.log('User created successfully:', newUser);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 