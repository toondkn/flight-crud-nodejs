import type { MiddlewareHandler } from 'hono';
// import { MongoClient } from 'mongodb';
import type { SchemaEnv } from './schema-env.ts';

export type MongoEnv = {
    Bindings: {
        mongo: {
            // TODO: expose collections here
        };
    };
};

export const mongoMiddleware: MiddlewareHandler<SchemaEnv & MongoEnv> = async (c, next) => {
    // const client = new MongoClient(c.env.MONGO_URL);
    c.env.mongo = {
        // TODO: expose collections here
    };
    await next();
};
