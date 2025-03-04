import { serve } from '@hono/node-server';
import { getServerEnv } from './env.ts';
import { api } from './index.ts';

const port = getServerEnv().SERVER_PORT;

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
