import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { mongoCollectionsMiddleware, type MongoEnv } from './middlewares/mongo-collections.ts';
import { strictEnvMiddleware, type SchemaEnv } from './middlewares/strict-env.ts';
import { index } from './routes/index.ts';
import { loadEnvSchema, ServerEnvSchema } from './schemas/env.ts';

const nodeEnv = loadEnvSchema(ServerEnvSchema, process.env);
const port = nodeEnv.SERVER_PORT;

export type ServerEnv = SchemaEnv & MongoEnv;

const api = new OpenAPIHono<ServerEnv>()
    .doc('/openapi/doc', {
        openapi: '3.0.3',
        info: {
            version: '1.0.0',
            title: 'Aviobook Code Challenge',
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Everything authentication related',
            },
            {
                name: 'Flights',
                description: 'Flight resources'
            },
        ],
    })
    .get('/openapi', swaggerUI({ url: '/openapi/doc' }))
    .use('*', strictEnvMiddleware(process.env))
    .use('*', mongoCollectionsMiddleware)
    .route('/', index)
    ;

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
