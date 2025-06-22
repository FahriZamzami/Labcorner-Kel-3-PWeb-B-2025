async function testAnnouncementAPI() {
  try {
    const response = await fetch('http://localhost:3000/pengumuman', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        judul: 'Test Pengumuman',
        isi: 'Ini adalah test pengumuman untuk debugging',
        lab_tujuan: 'lea',
        prioritas: 'sedang'
      })
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAnnouncementAPI(); 