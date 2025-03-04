import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { loadEnvSchema, ServerEnvSchema } from './env.ts';
import { nodeEnvMiddleware } from './middlewares/node-env.ts';
import { strictEnvMiddleware, type SchemaEnv } from './middlewares/strict-env.ts';
import { index } from './routes/index.ts';

const nodeEnv = loadEnvSchema(ServerEnvSchema, process.env);
const port = nodeEnv.SERVER_PORT;

export type ServerEnv = SchemaEnv;

const api = new OpenAPIHono<ServerEnv>()
    .doc('/openapi/doc', {
        openapi: '3.0.3',
        info: {
            version: '1.0.0',
            title: 'Aviobook Code Challenge',
        },
    })
    .get('/openapi', swaggerUI({ url: '/openapi/doc' }))
    .use('*', nodeEnvMiddleware)
    .use('*', strictEnvMiddleware)
    .route('/', index)
    ;

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
