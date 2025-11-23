const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Story = require('./models/Story');
const User = require('./models/User');
const dummyStories = require('./data/dummyStories');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Get all users
    const users = await User.find();
    
    if (users.length === 0) {
      console.log('No users found. Please register a user first.');
      process.exit(1);
    }

    // Delete existing stories
    await Story.deleteMany();

    // Add author to stories
    const sampleStories = dummyStories.map(imageUrl => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return { 
        imageUrl,
        author: randomUser._id 
      };
    });

    await Story.insertMany(sampleStories);

    console.log('Stories Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
