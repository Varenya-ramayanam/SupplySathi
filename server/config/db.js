const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

module.exports = connectToDb;