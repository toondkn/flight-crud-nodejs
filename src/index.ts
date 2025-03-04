import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { honoSafeEnvMiddleware } from './env.ts';
import { auth } from './routes/auth.ts';

export const api = new OpenAPIHono()
    .doc('/openapi/doc', {
        openapi: '3.0.3',
        info: {
            version: '1.0.0',
            title: 'Aviobook Code Challenge',
        },
    })
    .use('*', honoSafeEnvMiddleware)
    .get('/openapi', swaggerUI({ url: '/openapi/doc' }))
    .route('/auth', auth)
    ;
