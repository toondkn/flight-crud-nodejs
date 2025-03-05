import type { z } from 'zod';
import type { TokenResponse } from '../schemas/token-response.ts';
import type { RoutesClient } from './routes.ts';

export async function getJwt(client: RoutesClient['client']) {
    const response = await client.auth.$post({
        json: {
            username: 'aviobook',
            password: 'assessment',
        },
    });
    const { token } = await response.json() as z.infer<typeof TokenResponse>;
    return token;
}
