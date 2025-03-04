import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { AuthenticationRequest } from '../../schemas/authentication-request.ts';
import { TokenResponse } from '../../schemas/token-response.ts';
import type { AuthEnv } from './index.ts';

export const signatureAlgo = 'HS512';

type UnixTimestamp = number;

export type AuthPayload = {
    exp: UnixTimestamp;
    iat: UnixTimestamp;
    username: string;
};

const AuthRoute = createRoute({
    method: 'post',
    path: '/',
    tags: [
        'Authentication',
    ],
    summary: 'Create a token for a user',
    operationId: 'createToken',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: AuthenticationRequest,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Successful operation',
            content: {
                'application/json': {
                    schema: TokenResponse,
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

export const post = new OpenAPIHono<AuthEnv>()
    .openapi(AuthRoute, async c => {
        const { username, password } = c.req.valid('json');
        // HARDCODED: credential check
        const validUsername = 'aviobook';
        const validPassword = 'assessment';
        const hasValidCredentials = username === validUsername && password === validPassword;
        if (!hasValidCredentials)
            throw new HTTPException(400, { message: 'Please use hardcoded credentials: username "aviobook" password "assessment".' });
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + Math.floor(c.env.JWT_VALIDITY_IN_MINUTES * 60);
        const payload: AuthPayload = { iat, exp, username };
        const secret = c.env.JWT_SECRET;
        const token = await sign(payload, secret, signatureAlgo);
        return c.json({ token }, 200);
    })
    ;
