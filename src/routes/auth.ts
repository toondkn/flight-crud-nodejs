import { OpenAPIHono } from '@hono/zod-openapi';
import { post } from './auth/post.ts';

export const auth = new OpenAPIHono()
    .route('/', post)
    ;
