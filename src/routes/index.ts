import { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from '../server.ts';
import { auth } from './auth.ts';

export const api = new OpenAPIHono<Env>()
    .route('/auth', auth)
    ;
