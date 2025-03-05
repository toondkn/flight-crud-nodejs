import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { AuthorizationHeader } from '../../schemas/authorization-header.ts';
import type { FlightsEnv } from './index.ts';

const Route = createRoute({
    method: 'get',
    path: '/{flightId}',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Flights',
    ],
    summary: 'Retrieve a flight',
    operationId: 'retrieveFlight',
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
        200: {
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

export const get = new OpenAPIHono<FlightsEnv>()
    .openapi(Route, async c => {
        const { flightId } = c.req.valid('param');
        try {
            const flightData = await c.env.mongo.flights.findOne(flightId);
            const flight = { id: flightId, ...flightData };
            return c.json(flight, 200);
        }
        catch (e) {
            throw new HTTPException(404);
        }
    })
    ;
