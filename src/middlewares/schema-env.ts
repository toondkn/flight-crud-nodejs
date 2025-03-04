import type { MiddlewareHandler } from 'hono';
import type { z } from 'zod';
import { EnvSchema, loadEnvSchema } from '../env.ts';

export type SchemaEnv = {
    Bindings: z.infer<typeof EnvSchema>;
};

export const schemaEnvMiddleware: MiddlewareHandler<SchemaEnv> = async (c, next) => {
    c.env = loadEnvSchema(EnvSchema, c.env);
    await next();
};
