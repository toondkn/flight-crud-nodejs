import type { MiddlewareHandler } from 'hono';
import { MongoClient } from 'mongodb';
import type { z } from 'zod';
import { createCollections } from '../mongo/collections.ts';
import { MongoStrictCollection } from '../mongo/mongo-strict-collection.ts';
import { Flight } from '../schemas/flight.ts';
import type { SchemaEnv } from './strict-env.ts';

export type MongoEnv = {
    Bindings: {
        mongo: {
            flights: MongoStrictCollection<z.infer<typeof Flight>>;
        };
    };
};

export const mongoDataMiddleware: MiddlewareHandler<SchemaEnv & MongoEnv> = async (c, next) => {
    const client = new MongoClient(c.env.MONGO_URL);
    const db = client.db();
    c.env.mongo = createCollections(db);
    await next();
};
