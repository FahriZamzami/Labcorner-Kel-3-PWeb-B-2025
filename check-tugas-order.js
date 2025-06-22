const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTugasOrder() {
    try {
        console.log('=== CHECKING TUGAS ORDER ===');
        
        const tugas = await prisma.tugas.findMany({
            orderBy: { batas_waktu: 'asc' }
        });

        console.log('Tugas ordered by batas_waktu:');
        tugas.forEach((t, index) => {
            console.log(`${index + 1}. ID: ${t.id} | Judul: ${t.judul} | Batas: ${t.batas_waktu}`);
        });

        // Coba urutkan berdasarkan judul
        const tugasByJudul = await prisma.tugas.findMany({
            orderBy: { judul: 'asc' }
        });

        console.log('\nTugas ordered by judul:');
        tugasByJudul.forEach((t, index) => {
            console.log(`${index + 1}. ID: ${t.id} | Judul: ${t.judul} | Batas: ${t.batas_waktu}`);
        });

        // Coba urutkan berdasarkan ID
        const tugasById = await prisma.tugas.findMany({
            orderBy: { id: 'asc' }
        });

        console.log('\nTugas ordered by ID:');
        tugasById.forEach((t, index) => {
            console.log(`${index + 1}. ID: ${t.id} | Judul: ${t.judul} | Batas: ${t.batas_waktu}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTugasOrder(); 