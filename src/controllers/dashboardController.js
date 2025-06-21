exports.showDashboard = (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
};

exports.showInformasi = (req, res) => {
  res.render('informasi', { title: 'Informasi Lab' });
};

