import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AuthorizationHeader } from '../../schemas/authorization-header.ts';
import { Flight } from '../../schemas/flight.ts';
import type { FlightsEnv } from './index.ts';

const Route = createRoute({
    method: 'get',
    path: '/',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Flights',
    ],
    summary: 'Retrieve all flights',
    operationId: 'retrieveAllFlights',
    request: {
        headers: AuthorizationHeader,
    },
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: z.array(Flight.extend({ id: z.string() })),
                },
            },
        },
        401: {
            description: 'User is not authenticated',
        },
        500: {
            description: 'Something went wrong',
        },
    },
});

export const getList = new OpenAPIHono<FlightsEnv>()
    .openapi(Route, async c => {
        const flights = await c.env.mongo.flights.findAll();
        return c.json(flights, 200);
    })
    ;
