import { OpenAPIHono } from '@hono/zod-openapi';
import { testClient } from 'hono/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { after } from 'node:test';
import { strictEnvMiddleware } from '../middlewares/strict-env.ts';
import { createCollections } from '../mongo/collections.ts';
import { index } from '../routes/index.ts';
import type { ServerEnv } from '../server.ts';

export async function createRoutesClient() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const mongoClient = await MongoClient.connect(uri, {});
    const collections = createCollections(mongoClient.db());
    const api = new OpenAPIHono<ServerEnv>()
        .use('*', strictEnvMiddleware({
            JWT_SECRET: 'thisisalongsecrettoguardagainstbruteforcingbymaliciousoutsideactors',
            JWT_VALIDITY_IN_MINUTES: '10',
            MONGO_URI: uri,
        }))
        .use('*', async (c, next) => {
            c.env.mongo = collections;
            await next();
        })
        .route('/', index)
        ;
    const client = testClient(api);
    after(async () => {
        await mongoClient.close();
        await mongod.stop();
    });
    return { client, collections };
}

export type RoutesClient = Awaited<ReturnType<typeof createRoutesClient>>;
