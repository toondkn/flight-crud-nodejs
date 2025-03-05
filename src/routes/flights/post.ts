import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AuthorizationHeader } from '../../schemas/authorization-header.ts';
import { Flight } from '../../schemas/flight.ts';
import type { FlightsEnv } from './index.ts';

const Route = createRoute({
    method: 'post',
    path: '/',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Flights',
    ],
    summary: 'Create a flight',
    operationId: 'createFlight',
    request: {
        headers: AuthorizationHeader,
        body: {
            content: {
                'application/json': {
                    schema: Flight,
                },
            },
        },
    },
    responses: {
        201: {
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
        500: {
            description: 'Something went wrong',
        },
    },
});

export const post = new OpenAPIHono<FlightsEnv>()
    .openapi(Route, async c => {
        const flightData = c.req.valid('json');
        const flight = await c.env.mongo.flights.insertOne(flightData);
        return c.json(flight, 201);
    })
    ;
