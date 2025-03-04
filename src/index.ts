import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { authRouter } from './routes/auth.ts';

const indexRouter = new OpenAPIHono();

// TODO: add automatically inferred openAPI spec and serve it as webpage

indexRouter.onError((e, c) => {
    console.error(`${e.name} - ${e.message}: ${e.cause ?? 'Unknown cause.'}`);
    if (e instanceof HTTPException)
        return c.text(e.message, e.status);
    return c.text('Something went wrong', 500);
});
indexRouter.route('/auth', authRouter);

export { indexRouter };
