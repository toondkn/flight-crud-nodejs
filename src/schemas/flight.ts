import { z } from '@hono/zod-openapi';

export const Flight = z
    .object({
        aircraft: z.string().min(1).max(10),
        flightNumber: z.string().min(1).max(10),
        schedule: z.object({
            std: z.date(),
            sta: z.date(),
        }),
        departure: z.string().length(4),
        destination: z.string().length(4),
    })
    .openapi('Flight')
    ;
