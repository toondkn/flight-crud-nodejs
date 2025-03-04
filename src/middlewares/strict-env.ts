import type { MiddlewareHandler } from 'hono';
import type { z } from 'zod';
import { EnvSchema, loadEnvSchema } from '../schemas/env.ts';

export type SchemaEnv = {
    Bindings: z.infer<typeof EnvSchema>;
};

export const strictEnvMiddleware: MiddlewareHandler<SchemaEnv> = async (c, next) => {
    c.env = loadEnvSchema(EnvSchema, c.env);
    await next();
};
