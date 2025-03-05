import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { AuthorizationHeader } from '../../schemas/authorization-header.ts';
import { Flight } from '../../schemas/flight.ts';
import type { FlightsEnv } from './index.ts';

const Route = createRoute({
    method: 'patch',
    path: '/{flightId}',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Flights',
    ],
    summary: 'Update a flight',
    operationId: 'updateFlight',
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
        body: {
            content: {
                'application/json': {
                    schema: Flight,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: Flight.extend({ id: z.string() }),
                },
            },
        },
        400: {
            description: 'Invalid payload',
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

export const patch = new OpenAPIHono<FlightsEnv>()
    .openapi(Route, async c => {
        const { flightId } = c.req.valid('param');
        const flightData = c.req.valid('json');
        try {
            const flight = await c.env.mongo.flights.replaceOne(flightId, flightData);
            return c.json(flight, 200);
        }
        catch (e) {
            throw new HTTPException(404);
        }
    })
    ;
