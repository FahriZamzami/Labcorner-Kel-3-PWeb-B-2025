const homeController = {
  // Halaman utama setelah bergabung dengan lab
  getHome(req, res) {
    const currentLab = req.session.currentLab;
    if (!currentLab) {
      return res.redirect('/pilihLab');
    }
    res.render('home', { currentLab, currentPage: 'home' });
  }
};

module.exports = homeController; 