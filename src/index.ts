import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { authRouter } from './routes/auth.ts';

const api = new OpenAPIHono();

api.route('/auth', authRouter);

api.doc('/openapi/doc', {
    openapi: '3.0.3',
    info: {
        version: '1.0.0',
        title: 'Aviobook Code Challenge',
    },
});
api.get('/openapi', swaggerUI({ url: '/openapi/doc' }));

export { api };
