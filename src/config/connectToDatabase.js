import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

connectDatabase();
