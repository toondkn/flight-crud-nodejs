import { serve } from '@hono/node-server';
import { env } from './env.ts';
import { api } from './index.ts';

const port = env.SERVER_PORT;

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
