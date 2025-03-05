import type { MiddlewareHandler } from 'hono';
import type { z } from 'zod';
import { EnvSchema, loadEnvSchema } from '../schemas/env.ts';

export type SchemaEnv = {
    Bindings: z.infer<typeof EnvSchema>;
};

export const strictEnvMiddleware: (env: Record<string, string | undefined>) => MiddlewareHandler<SchemaEnv> = env => async (c, next) => {
    c.env = loadEnvSchema(EnvSchema, env);
    await next();
};
