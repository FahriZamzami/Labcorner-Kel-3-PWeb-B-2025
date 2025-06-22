const bcrypt = require('bcrypt');
const prisma = require('../../prisma/client');

async function main() {
    const existingAdmin = await prisma.user.findUnique({
    where: { id: 'adm001' }, // bisa diganti dengan unique lain seperti username
    });

    if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('saya suka durian', 10);

    await prisma.user.create({
        data: {
        id: 'adm001',
        username: 'admin',
        kata_sandi: hashedPassword,
        peran: 'admin',
        // dibuat_pada akan otomatis default ke now() kalau diset di schema.prisma
        },
    });

    console.log('Admin user created.');
    } else {
    console.log('Admin user already exists.');
    }

    // Create sample mahasiswa user
    const existingMahasiswa = await prisma.user.findUnique({
        where: { id: 'mhs001' }
    });

    if (!existingMahasiswa) {
        await prisma.user.create({
            data: {
                id: 'mhs001',
                username: 'mahasiswa1',
                kata_sandi: 'password123',
                peran: 'mahasiswa'
            }
        });
        console.log('Mahasiswa user created.');
    } else {
        console.log('Mahasiswa user already exists.');
    }

    // Create sample lab and praktikum
    const existingLab = await prisma.lab.findFirst();
    let labId;

    if (!existingLab) {
        const lab = await prisma.lab.create({
            data: {
                nama_lab: 'Lab Komputer 1'
            }
        });
        labId = lab.id;
        console.log('Lab created.');
    } else {
        labId = existingLab.id;
    }

    const existingPraktikum = await prisma.praktikum.findFirst();
    let praktikumId;

    if (!existingPraktikum) {
        const praktikum = await prisma.praktikum.create({
            data: {
                nama_praktikum: 'Praktikum Pemrograman Web',
                lab_id: labId
            }
        });
        praktikumId = praktikum.id;
        console.log('Praktikum created.');
    } else {
        praktikumId = existingPraktikum.id;
    }

    // Create sample jadwal
    const existingJadwal = await prisma.jadwal.findFirst();
    let jadwalId;
    if (!existingJadwal) {
        const jadwal = await prisma.jadwal.create({
            data: {
                praktikum_id: praktikumId,
                tanggal: new Date('2024-01-15'),
                jam: new Date('2024-01-15T08:00:00'),
                ruangan: 'Lab 1.1',
                user_id: 'mhs001',
                nama_pengajar: 'Dr. John Doe',
                semester: 'Ganjil 2023/2024'
            }
        });
        jadwalId = jadwal.id;
        console.log('Jadwal created.');
    } else {
        jadwalId = existingJadwal.id;
        console.log('Jadwal already exists.');
    }

    // Create sample absensi
    const existingAbsensi = await prisma.absensi.findFirst();
    if (!existingAbsensi) {
        // Create multiple attendance records for different dates
        const jadwalId = existingJadwal ? existingJadwal.id : 1;
        
        const absensiData = [
            { status: 'Hadir', tanggal: new Date('2024-01-15') },
            { status: 'Hadir', tanggal: new Date('2024-01-22') },
            { status: 'Tidak_Hadir', tanggal: new Date('2024-01-29') },
            { status: 'Hadir', tanggal: new Date('2024-02-05') },
            { status: 'Hadir', tanggal: new Date('2024-02-12') }
        ];

        for (const absen of absensiData) {
            await prisma.absensi.create({
                data: {
                    user_id: 'mhs001',
                    jadwal_id: jadwalId,
                    status: absen.status
                }
            });
        }
        console.log('Sample absensi created.');
    } else {
        console.log('Absensi already exists.');
    }

    // Create sample nilai (grades)
    const existingNilai = await prisma.nilai.findFirst();
    if (!existingNilai) {
        // Create sample grades for the existing jadwal
        const jadwalId = existingJadwal ? existingJadwal.id : 1;
        
        const nilaiData = [
            { jenis: 'Responsi', skor: 85 },
            { jenis: 'Responsi', skor: 88 },
            { jenis: 'Kuis', skor: 90 },
            { jenis: 'Kuis', skor: 87 },
            { jenis: 'Instruksi', skor: 92 },
            { jenis: 'Instruksi', skor: 89 },
            { jenis: 'Tugas', skor: 88 },
            { jenis: 'Ujian', skor: 92 }
        ];

        for (const nilai of nilaiData) {
            await prisma.nilai.create({
                data: {
                    user_id: 'mhs001',
                    jadwal_id: jadwalId,
                    jenis: nilai.jenis,
                    skor: nilai.skor
                }
            });
        }
        console.log('Sample nilai created.');
    } else {
        console.log('Nilai already exists.');
    }
}

main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
    })
    .finally(() => prisma.$disconnect());
