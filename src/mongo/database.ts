import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGO_URL;
if (mongoUrl === undefined)
    throw new Error('Please set the MONGO_URL environment variable.');
const client = new MongoClient(mongoUrl);
export const database = client.db();
