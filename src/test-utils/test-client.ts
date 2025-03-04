import { OpenAPIHono } from '@hono/zod-openapi';
import { testClient } from 'hono/testing';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { strictEnvMiddleware } from '../middlewares/strict-env.ts';
import { createCollections } from '../mongo/collections.ts';
import type { FlightsEnv } from '../routes/flights/index.ts';
import { index } from '../routes/index.ts';
import { mockNodeEnvMiddleware } from './mock-node-env.ts';

export function createTestClient(mongod: MongoMemoryServer) {
    const mongoClient = new MongoClient(mongod.getUri());
    const api = new OpenAPIHono<FlightsEnv>()
        .use('*', mockNodeEnvMiddleware(mongod.getUri()))
        .use('*', strictEnvMiddleware)
        .route('/', index)
        ;
    const client = testClient(api);
    const collections = createCollections(mongoClient.db());
    async function cleanup() {
        await mongoClient.close();
    }
    return { client, collections, cleanup };
}
