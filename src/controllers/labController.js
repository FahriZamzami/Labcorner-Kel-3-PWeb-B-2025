exports.showLabDetail = (req, res) => {
  const labMap = {
    lea: {
      nama: 'LEA',
      deskripsi: 'Laboratorium Enterprise Application',
      jumlahAsisten: 4,
      jumlahModul: 6,
      jumlahKelas: 3,
      jadwal: 'Senin & Rabu 08:00 - 12:00',
      asisten: ['Rina', 'Bayu', 'Dina', 'Joko'],
      mahasiswa: ['Ayu', 'Fajar', 'Rizky', 'Nina']
    },
    labgis: {
      nama: 'GIS',
      deskripsi: 'Laboratorium Geographic Information System',
      jumlahAsisten: 3,
      jumlahModul: 5,
      jumlahKelas: 2,
      jadwal: 'Selasa & Kamis 10:00 - 14:00',
      asisten: ['Hani', 'Agus', 'Sinta'],
      mahasiswa: ['Lina', 'Yoga', 'Ilham']
    },
    lbi: {
      nama: 'LBI',
      deskripsi: 'Laboratorium Business Intelligence',
      jumlahAsisten: 5,
      jumlahModul: 7,
      jumlahKelas: 4,
      jadwal: 'Senin & Jumat 13:00 - 17:00',
      asisten: ['Mira', 'Gilang', 'Andi', 'Rita', 'Budi'],
      mahasiswa: ['Tina', 'Bayu', 'Fikri', 'Nadia']
    },
    ldkom: {
      nama: 'LDKOM',
      deskripsi: 'Laboratorium Dasar Komputasi',
      jumlahAsisten: 2,
      jumlahModul: 4,
      jumlahKelas: 2,
      jadwal: 'Rabu & Jumat 09:00 - 11:00',
      asisten: ['Dewi', 'Wawan'],
      mahasiswa: ['Sari', 'Teguh', 'Andin']
    }
  };

  const lab = labMap[req.params.nama];
  if (!lab) return res.status(404).send('Lab tidak ditemukan');
  res.render('lab_detail', { title: `Detail ${lab.nama}`, lab });
};
