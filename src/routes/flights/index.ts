import { OpenAPIHono } from '@hono/zod-openapi';
import { jwtAuthMiddleware, type JwtAuthEnv } from '../../middlewares/jwt-auth.ts';
import type { ServerEnv } from '../../server.ts';
import { del } from './del.ts';
import { getList } from './get-list.ts';
import { get } from './get.ts';
import { patch } from './patch.ts';
import { post } from './post.ts';

export type FlightsEnv = ServerEnv & JwtAuthEnv;

export const flights = new OpenAPIHono<FlightsEnv>()
    .use('*', jwtAuthMiddleware)
    .route('/', getList)
    .route('/', post)
    .route('/', get)
    .route('/', patch)
    .route('/', del)
    ;
