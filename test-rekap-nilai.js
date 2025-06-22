const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRekapNilai() {
  try {
    await prisma.$connect();
    console.log('Testing rekap nilai functionality...');
    
    // Test query rekap nilai
    const rekapNilai = await prisma.pengumpulan.findMany({
      include: {
        user: {
          select: {
            username: true,
            peran: true
          }
        },
        tugas: {
          select: {
            judul: true
          }
        }
      },
      where: {
        user: {
          peran: 'mahasiswa'
        }
      },
      orderBy: [
        { user: { username: 'asc' } },
        { tugas: { judul: 'asc' } }
      ]
    });
    
    console.log(`✅ Total pengumpulan: ${rekapNilai.length}`);
    
    // Hitung nilai rata-rata
    const nilaiValues = rekapNilai
      .filter(item => item.nilai !== null)
      .map(item => item.nilai);
    
    const nilaiRataRata = nilaiValues.length > 0 
      ? (nilaiValues.reduce((sum, nilai) => sum + nilai, 0) / nilaiValues.length).toFixed(2)
      : 0;
    
    console.log(`✅ Nilai rata-rata: ${nilaiRataRata}`);
    
    // Kelompokkan data berdasarkan mahasiswa
    const dataMahasiswa = {};
    rekapNilai.forEach(item => {
      const username = item.user.username;
      if (!dataMahasiswa[username]) {
        dataMahasiswa[username] = {
          username: username,
          tugas: []
        };
      }
      dataMahasiswa[username].tugas.push({
        judul: item.tugas.judul,
        nilai: item.nilai || '-',
        waktu_kirim: item.waktu_kirim
      });
    });
    
    console.log(`✅ Total mahasiswa: ${Object.keys(dataMahasiswa).length}`);
    
    // Tampilkan beberapa data contoh
    if (rekapNilai.length > 0) {
      console.log('\n📊 Sample data:');
      rekapNilai.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.user.username} - ${item.tugas.judul} - Nilai: ${item.nilai || '-'}`);
      });
    }
    
    console.log('\n🎉 Rekap nilai functionality is ready!');
    console.log('Route: GET /rekapNilai');
    console.log('Controller: rekapNilaiController.getRekapNilai');
    console.log('View: rekapNilai.ejs');
    
  } catch (error) {
    console.error('❌ Error testing rekap nilai:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function checkData() {
    try {
        console.log('=== CHECKING REKAP NILAI DATA ===\n');

        // Cek data user mahasiswa
        const users = await prisma.user.findMany({
            where: { peran: 'mahasiswa' },
            select: { id: true, username: true, peran: true }
        });
        console.log('Users (mahasiswa):', users.length);
        console.log(users);
        console.log('');

        // Cek data tugas
        const tugas = await prisma.tugas.findMany({
            select: { id: true, judul: true }
        });
        console.log('Tugas:', tugas.length);
        console.log(tugas);
        console.log('');

        // Cek data pengumpulan
        const pengumpulan = await prisma.pengumpulan.findMany({
            include: {
                user: { select: { username: true, peran: true } },
                tugas: { select: { judul: true } }
            }
        });
        console.log('Pengumpulan:', pengumpulan.length);
        console.log(pengumpulan);
        console.log('');

        // Cek data pengumpulan dengan filter mahasiswa
        const pengumpulanMahasiswa = await prisma.pengumpulan.findMany({
            include: {
                user: { select: { username: true, peran: true } },
                tugas: { select: { judul: true } }
            },
            where: {
                user: {
                    peran: 'mahasiswa'
                }
            }
        });
        console.log('Pengumpulan Mahasiswa:', pengumpulanMahasiswa.length);
        console.log(pengumpulanMahasiswa);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testRekapNilai();
checkData(); 