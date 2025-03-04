import { z, ZodError } from 'zod';

const EnvSchema = z.object({
    SERVER_PORT: z.coerce.number().min(0).max(65535),
    // Brute force protection: minimum recommendation for HSA512 hashing is a secret of at least 64 bytes.
    JWT_SECRET: z.string().min(64),
    MONGO_URL: z.string().regex(/^(mongodb(?:\+srv)?:\/\/)(?:(?:[^:@]+?):(?:[^:@]+?)@)?(?:[^@\/?]+?)(?::\d+)?(?:\/[^?]*)?(?:\?.*)?$/),
});

let env: z.infer<typeof EnvSchema>;
try {
    env = EnvSchema.parse(process.env);
}
catch (e) {
    if (!(e instanceof ZodError))
        throw e;
    for (const error of e.errors)
        console.error(`INVALID ENVIRONMENT VARIABLE: ${error.path.join('.')} - ${error.message}`);
    throw new Error('Failed to load environment variables.');
}

export { env };
