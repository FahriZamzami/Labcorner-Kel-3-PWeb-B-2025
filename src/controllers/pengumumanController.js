exports.showPengumuman = (req, res) => {
  res.render('pengumuman', { title: 'Pengumuman' });
};

exports.handlePengumuman = (req, res) => {
  console.log(req.body); // simpan ke DB nanti
  res.redirect('/');
};
