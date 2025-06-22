// src/controllers/userController.js

const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

// Menampilkan halaman daftar semua user dari database
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.render('daftar-user', {
      title: 'Daftar Semua User',
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengambil data user");
  }
};

// Menampilkan halaman form untuk menambah user baru
exports.getAddUserPage = (req, res) => {
  res.render('tambah-user', { title: 'Tambah User Baru' });
};

// Memproses penambahan user baru ke database
exports.addUser = async (req, res) => {
  const { nama, username, password, peran } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        fullName: nama,
        username: username,
        password: hashedPassword,
        role: peran,
      },
    });
    res.status(201).json({ message: 'User berhasil ditambahkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan user' });
  }
};

// Menampilkan halaman untuk menghapus user
exports.getDeleteUserPage = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: { not: 'Admin' } // Contoh: Admin tidak bisa dihapus
            }
        });
        res.render('hapus-user', { title: 'Hapus User', users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengambil data user");
    }
};

// Memproses penghapusan user dari database
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.body; // Asumsi form mengirim ID
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus user' });
    }
};

// Memproses update data user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, username, peran } = req.body;
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName: nama,
        username,
        role: peran,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({ message: 'Perubahan berhasil disimpan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan perubahan' });
  }
};