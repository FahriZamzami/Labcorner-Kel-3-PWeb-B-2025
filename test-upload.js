const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUpload() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    const tugasId = 7;
    const userId = 'user1';
    
    // Test query tugas
    const tugas = await prisma.tugas.findUnique({
      where: { id: tugasId }
    });
    console.log('Tugas:', tugas ? tugas.judul : 'Not found');
    
    // Test query user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log('User:', user ? user.username : 'Not found');
    
    // Test query pengumpulan existing
    const existingSubmission = await prisma.pengumpulan.findFirst({
      where: {
        tugas_id: tugasId,
        user_id: userId
      }
    });
    console.log('Existing submission:', existingSubmission);
    
    // Test create pengumpulan (simulasi)
    if (!existingSubmission) {
      console.log('Testing create submission...');
      const testSubmission = await prisma.pengumpulan.create({
        data: {
          tugas_id: tugasId,
          user_id: userId,
          file_path: 'test-file.pdf',
          waktu_kirim: new Date()
        }
      });
      console.log('Test submission created:', testSubmission);
      
      // Clean up - delete test submission
      await prisma.pengumpulan.delete({
        where: { id: testSubmission.id }
      });
      console.log('Test submission deleted');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpload(); 