import { OpenAPIHono } from '@hono/zod-openapi';
import type { ServerEnv } from '../server.ts';
import { auth } from './auth/index.ts';
import { flights } from './flights/index.ts';

export const index = new OpenAPIHono<ServerEnv>()
    .route('/auth', auth)
    .route('/flights', flights)
    ;
