import { OpenAPIHono } from '@hono/zod-openapi';
import type { MiddlewareHandler } from 'hono';
import { testClient } from 'hono/testing';
import { schemaEnvMiddleware, type SchemaEnv } from '../middlewares/schema-env.ts';
import { api } from '../routes/index.ts';
import type { Env } from '../server.ts';

const mockEnvMiddleware: MiddlewareHandler<SchemaEnv> = async (c, next) => {
    c.env = {
        ...c.env,
        JWT_SECRET: 'thisisalongsecrettoguardagainstbruteforcingbymaliciousoutsideactors',
        // This is not yet a proper URL. It must be bound to an in-memory mongodb server purely for testing purposes.
        MONGO_URL: 'mongodb://localhost:3000',
    };
    await next();
};

const testApi = new OpenAPIHono<Env>()
    .use('*', mockEnvMiddleware)
    .use('*', schemaEnvMiddleware)
    .route('/', api)
    ;

export const client = testClient(testApi);
