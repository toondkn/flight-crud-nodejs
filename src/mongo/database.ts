import { MongoClient } from 'mongodb';
import { env } from '../env.ts';

const client = new MongoClient(env.MONGO_URL);
export const database = client.db();
