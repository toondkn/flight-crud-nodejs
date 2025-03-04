import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { auth } from './routes/auth.ts';

export const api = new OpenAPIHono()
    .doc('/openapi/doc', {
        openapi: '3.0.3',
        info: {
            version: '1.0.0',
            title: 'Aviobook Code Challenge',
        },
    })
    .get('/openapi', swaggerUI({ url: '/openapi/doc' }))
    .route('/auth', auth)
    ;
