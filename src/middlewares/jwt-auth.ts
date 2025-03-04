import type { MiddlewareHandler } from 'hono';
import { jwt, type JwtVariables } from 'hono/jwt';
import { signatureAlgo, type AuthPayload } from '../routes/auth/post.ts';
import type { SchemaEnv } from './strict-env.ts';

export type JwtAuthEnv = {
    Variables: JwtVariables<AuthPayload>;
};

export const jwtAuthMiddleware: MiddlewareHandler<SchemaEnv & JwtAuthEnv> = async (c, next) => {
    return jwt({
        secret: c.env.JWT_SECRET,
        alg: signatureAlgo,
    })(c, next);
};
