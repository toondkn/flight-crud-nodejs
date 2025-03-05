import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { AuthorizationHeader } from '../../schemas/authorization-header.ts';
import type { FlightsEnv } from './index.ts';

const Route = createRoute({
    method: 'delete',
    path: '/{flightId}',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Flights',
    ],
    summary: 'Remove a flight',
    operationId: 'deleteFlight',
    request: {
        headers: AuthorizationHeader,
        params: z.object({
            flightId: z.string().openapi({
                param: {
                    name: 'flightId',
                    in: 'path',
                    description: 'Internal Identifier for the flight',
                },
            }),
        }),
    },
    responses: {
        204: {
            description: 'Successful operation',
        },
        401: {
            description: 'User is not authenticated',
        },
        404: {
            description: 'Flight not found',
        },
        500: {
            description: 'Something went wrong',
        },
    },
});

export const del = new OpenAPIHono<FlightsEnv>()
    .openapi(Route, async c => {
        const { flightId } = c.req.valid('param');
        try {
            await c.env.mongo.flights.deleteOne(flightId);
        }
        catch (e) {
            throw new HTTPException(404);
        }
        c.status(204);
        return c.body(null);
    })
    ;
