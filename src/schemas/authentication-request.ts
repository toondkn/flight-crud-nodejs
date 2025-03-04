import { z } from '@hono/zod-openapi';

export const AuthenticationRequest = z
    .object({
        username: z.string(),
        password: z.string(),
    })
    .openapi('AuthenticationRequest')
    ;
