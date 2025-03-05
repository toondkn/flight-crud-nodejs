import { z } from '@hono/zod-openapi';

export const AuthenticationRequest = z
    .object({
        username: z.string().openapi({
            example: 'aviobook',
        }),
        password: z.string().openapi({
            example: 'assessment',
        }),
    })
    .openapi('AuthenticationRequest')
    ;
