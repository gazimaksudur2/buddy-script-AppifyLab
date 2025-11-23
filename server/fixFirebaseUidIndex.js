// Run this script once to fix the firebaseUid index issue
// Execute: node fixFirebaseUidIndex.js

const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the old non-sparse index
    try {
      await usersCollection.dropIndex('firebaseUid_1');
      console.log('Dropped old firebaseUid index');
    } catch (error) {
      console.log('Index might not exist or already dropped:', error.message);
    }

    // Create new sparse unique index
    await usersCollection.createIndex(
      { firebaseUid: 1 },
      { unique: true, sparse: true }
    );
    console.log('Created new sparse unique index for firebaseUid');

    console.log('Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
}

fixIndex();
