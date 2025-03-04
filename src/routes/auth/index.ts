import { OpenAPIHono } from '@hono/zod-openapi';
import type { ServerEnv } from '../../server.ts';
import { post } from './post.ts';

export type AuthEnv = ServerEnv;

export const auth = new OpenAPIHono<AuthEnv>()
    .route('/', post)
    ;
