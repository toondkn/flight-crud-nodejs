import type { MiddlewareHandler } from 'hono';

export const nodeEnvMiddleware: MiddlewareHandler = async (c, next) => {
    c.env = process.env;
    await next();
};
