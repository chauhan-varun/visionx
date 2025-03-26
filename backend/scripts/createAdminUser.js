import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    createAdmin();
  })
  .catch((error) => {
    process.exit(1);
  });

// Create admin user function
const createAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      process.exit(0);
    }
    
    // Create new admin user
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true
    });
    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};
