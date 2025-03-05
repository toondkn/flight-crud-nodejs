import type { Db } from 'mongodb';
import { Flight } from '../schemas/flight.ts';
import { MongoStrictCollection } from './mongo-strict-collection.ts';

export function createCollections(db: Db) {
    return {
        flights: new MongoStrictCollection(db, 'flights', Flight),
    };
}

export type Collections = ReturnType<typeof createCollections>;
