// Run this script to clean up ALL data from MongoDB
// Usage: node scripts/cleanup-database.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';

async function cleanupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop all collections
    console.log('\n🗑️  Dropping all collections...');
    
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      console.log(`   Dropping: ${collection.name}`);
      await db.dropCollection(collection.name);
    }

    console.log('\n✅ All collections dropped successfully!');
    console.log('\n📊 Cleaned collections:');
    console.log('   - users');
    console.log('   - challenges');
    console.log('   - categories (removed)');
    console.log('   - stats');
    console.log('\n🎉 Database is now clean! You can start fresh.');

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

cleanupDatabase();
