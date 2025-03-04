import type { z } from 'zod';
import type { TokenResponse } from '../schemas/token-response.ts';
import type { createTestClient } from './test-client.ts';

export async function getJwt(client: ReturnType<typeof createTestClient>['client']) {
    const response = await client.auth.$post({
        json: {
            username: 'aviobook',
            password: 'assessment',
        },
    });
    const { token } = await response.json() as z.infer<typeof TokenResponse>;
    return token;
}
