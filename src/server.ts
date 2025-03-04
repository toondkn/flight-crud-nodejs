import { serve } from '@hono/node-server';
import { api } from './index.ts';

// TODO: Implement a more scalable way of validating environment variable configuration
const port = Number.parseInt(process.env.PORT ?? '');
if (Number.isNaN(port) || port < 0 || port > 65535)
    throw new Error('Please set a valid value for environment variable "PORT": a number between 0 and 65535.');

serve({
    fetch: api.fetch,
    port,
}, () => console.log(`Server started on port ${port}.`));
