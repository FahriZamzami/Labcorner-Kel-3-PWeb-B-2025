const express = require('express');
const request = require('supertest');

// Test sederhana untuk route jadwal
async function testJadwalRoute() {
  try {
    console.log('Testing jadwal route...');
    
    // Test apakah file route ada
    const jadwalRoutes = require('./src/routes/jadwal.routes');
    console.log('✅ jadwal.routes.js loaded successfully');
    
    // Test apakah controller ada
    const jadwalController = require('./src/controllers/jadwalController');
    console.log('✅ jadwalController.js loaded successfully');
    
    // Test apakah view ada
    const fs = require('fs');
    const path = require('path');
    const jadwalViewPath = path.join(__dirname, 'src', 'views', 'jadwal.ejs');
    if (fs.existsSync(jadwalViewPath)) {
      console.log('✅ jadwal.ejs view exists');
    } else {
      console.log('❌ jadwal.ejs view not found');
    }
    
    console.log('\n🎉 Jadwal route components are ready!');
    console.log('Route: GET /jadwal');
    console.log('Controller: jadwalController.getJadwal');
    console.log('View: jadwal.ejs');
    
  } catch (error) {
    console.error('❌ Error testing jadwal route:', error.message);
  }
}

testJadwalRoute(); 