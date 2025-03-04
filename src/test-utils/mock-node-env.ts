import type { MiddlewareHandler } from 'hono';
import { type SchemaEnv } from '../middlewares/strict-env.ts';

export const mockNodeEnvMiddleware: (mongoUrl?: string) => MiddlewareHandler<SchemaEnv> = (mongoUrl) => async (c, next) => {
    c.env = {
        ...c.env,
        JWT_SECRET: 'thisisalongsecrettoguardagainstbruteforcingbymaliciousoutsideactors',
        JWT_VALIDITY_IN_MINUTES: 10,
        MONGO_URL: mongoUrl ?? 'mongodb://nowhere.com:1',
    };
    if (mongoUrl)
        c.env.MONGO_URL = mongoUrl;
    await next();
};
