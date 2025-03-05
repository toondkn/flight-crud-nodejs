import { z } from '@hono/zod-openapi';

export const AuthorizationHeader = z
    .object({
        Authorization: z
            .string()
            .regex(/^Bearer\s[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/i, {
                message: 'Invalid JWT token format. Expected "Bearer <token>"',
            })
            .transform(val => val.split(' ')[1])
            .openapi({
                param: {
                    name: 'Authorization',
                    in: 'header',
                },
                example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            })
        ,
    })
    .openapi('AuthorizationHeader')
    ;
