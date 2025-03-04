import { OpenAPIHono } from '@hono/zod-openapi';
import { jwtAuthMiddleware, type JwtAuthEnv } from '../../middlewares/jwt-auth.ts';
import { mongoDataMiddleware, type MongoEnv } from '../../middlewares/mongo-data.ts';
import type { ServerEnv } from '../../server.ts';
import { getAll } from './get-list.ts';

export type FlightsEnv = ServerEnv & JwtAuthEnv & MongoEnv;

export const flights = new OpenAPIHono<FlightsEnv>()
    .use('*', jwtAuthMiddleware)
    .use('*', mongoDataMiddleware)
    .route('/', getAll)
    ;
