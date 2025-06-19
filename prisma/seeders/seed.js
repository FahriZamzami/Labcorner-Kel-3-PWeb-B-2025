const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

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
}

main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
    })
    .finally(() => prisma.$disconnect());
