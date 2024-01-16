import mongoose from 'mongoose';
import {logger} from './winston';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.NEXT_ATLAS_URI as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
