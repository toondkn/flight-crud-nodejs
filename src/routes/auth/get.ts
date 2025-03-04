import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { env } from '../../env.ts';
import { genericErrorHandler } from '../../error-handler.ts';

const get = new OpenAPIHono();

const RequestBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

const TokenSchema = z
    .object({
        token: z.string(),
    })
    .openapi('Token')
    ;

const AuthRoute = createRoute({
    method: 'post',
    path: '/',
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        'Authentication',
    ],
    summary: 'Create a token for a user',
    operationId: 'createToken',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: RequestBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: TokenSchema,
                },
            },
        },
        400: {
            description: 'Invalid payload',
        },
        500: {
            description: 'Something went wrong',
        },
    },
});

get.onError(genericErrorHandler);

get.openapi(AuthRoute, async c => {
    const { username, password } = c.req.valid('json');
    // HARDCODED: credential check, there is no registration endpoint & flow yet
    const validUsername = 'aviobook';
    const validPassword = 'assessment';
    const hasValidCredentials = username === validUsername && password === validPassword;
    if (!hasValidCredentials)
        throw new HTTPException(400);
    const secret = env.JWT_SECRET;
    const token = await sign({ username }, secret, 'HS512');
    return c.json({ token });
});

export { get };
