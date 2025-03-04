import { z } from '@hono/zod-openapi';

export const TokenResponse = z
    .object({
        token: z.string(),
    })
    .openapi('TokenResponse')
    ;
