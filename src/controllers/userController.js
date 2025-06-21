exports.showAllUsers = (req, res) => {
  res.render('user', { title: 'Semua User' });
};

exports.showTambahUser = (req, res) => {
  res.render('user_tambah', { title: 'Tambah User' });
};

exports.showHapusUser = (req, res) => {
  res.render('user_hapus', { title: 'Hapus User' });
};