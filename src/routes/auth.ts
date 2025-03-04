import { OpenAPIHono } from '@hono/zod-openapi';
import { get } from './auth/get.ts';

const authRouter = new OpenAPIHono();

authRouter.route('/', get);

export { authRouter };
