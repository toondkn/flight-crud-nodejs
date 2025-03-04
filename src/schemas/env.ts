import { Schema, z, ZodError } from 'zod';

export const EnvSchema = z.object({
    // Brute force protection: minimum recommendation for HSA512 hashing is a secret of at least 64 bytes.
    JWT_SECRET: z.string().min(64),
    JWT_VALIDITY_IN_MINUTES: z.coerce.number().min(1).max(60),
    MONGO_URL: z.string().regex(/^(mongodb(?:\+srv)?:\/\/)(?:(?:[^:@]+?):(?:[^:@]+?)@)?(?:[^@\/?]+?)(?::\d+)?(?:\/[^?]*)?(?:\?.*)?$/),
});

export const ServerEnvSchema = z.object({
    SERVER_PORT: z.coerce.number().min(0).max(65535),
});

export function loadEnvSchema<T extends Schema>(schema: T, env: unknown): z.infer<T> {
    try {
        return schema.parse(env);
    }
    catch (e) {
        if (!(e instanceof ZodError))
            throw e;
        for (const error of e.errors)
            console.error(`INVALID ENVIRONMENT VARIABLE: ${error.path.join('.')} - ${error.message}`);
        throw new Error('Failed to load environment variables.');
    }
}
