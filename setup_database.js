const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Read database URL from .env
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrl = envContent.match(/DATABASE_URL="([^"]+)"/)?.[1];
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in .env file');
    }
    
    // Parse connection details
    const url = new URL(dbUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1)
    });
    
    console.log('🔗 Connected to database');
    
    // Read and execute SQL script
    const sqlPath = path.join(__dirname, 'update_lab_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️ Skipped duplicate entry');
          } else {
            console.log('⚠️ Statement failed (might already exist):', error.message);
          }
        }
      }
    }
    
    console.log('✅ Database setup completed');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

setupDatabase(); 