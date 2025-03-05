import { z } from '@hono/zod-openapi';

export const Flight = z
    .object({
        aircraft: z.string().min(1).max(10).openapi({
            example: 'CSTRC',
            description: 'A code describing the aircraft assigned to the flight',
        }),
        flightNumber: z.string().min(1).max(10).openapi({
            example: 'AVIO201',
            description: 'A code that identifies the flight',
        }),
        schedule: z.object({
            std: z.date().openapi({
                description: 'The scheduled time of departure, ISO 8601 format',
                format: 'date-time',
            }),
            sta: z.date().openapi({
                description: 'The scheduled time of arrival, ISO 8601 format',
                format: 'date-time',
            }),
        }),
        departure: z.string().length(4).openapi({
            description: 'Identifier for the departure airport',
            example: 'LPPD',
        }),
        destination: z.string().length(4).openapi({
            description: 'Identifier for the destination airport',
            example: 'LPLA',
        }),
    })
    .openapi('Flight')
    ;
