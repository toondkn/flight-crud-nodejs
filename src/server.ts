import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { loadEnvSchema, ServerEnvSchema } from './env.ts';
import { mongoMiddleware, type MongoEnv } from './middlewares/mongo.ts';
import { nodeEnvMiddleware } from './middlewares/node-env.ts';
import { schemaEnvMiddleware, type SchemaEnv } from './middlewares/schema-env.ts';
import { auth } from './routes/auth.ts';

const nodeEnv = loadEnvSchema(ServerEnvSchema, process.env);
const port = nodeEnv.SERVER_PORT;

export type Env = SchemaEnv & MongoEnv;

const api = new OpenAPIHono<Env>()
    .doc('/openapi/doc', {
        openapi: '3.0.3',
        info: {
            version: '1.0.0',
            title: 'Aviobook Code Challenge',
        },
    })
    .get('/openapi', swaggerUI({ url: '/openapi/doc' }))
    .use('*', nodeEnvMiddleware)
    .use('*', schemaEnvMiddleware)
    .use('*', mongoMiddleware)
    .route('/auth', auth)
    ;

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
