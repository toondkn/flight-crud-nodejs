import { decode } from 'hono/jwt';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createRoutesClient } from '../../test-utils/routes.ts';
import type { AuthPayload } from './post.ts';

describe('/auth POST', async () => {
    const { client } = await createRoutesClient();
    it('returns 400 when incorrect hardcoded credentials are received', async () => {
        const res = await client.auth.$post({
            json: {
                username: 'invalid_username',
                password: 'invalid_password',
            },
        });
        assert.strictEqual(res.status, 400);
    });
    it('returns 200 and a token when correct hardcoded credentials are received', async () => {
        const username = 'aviobook';
        const password = 'assessment';
        const res = await client.auth.$post({
            json: {
                username,
                password,
            },
        });
        assert.strictEqual(res.status, 200);
        const { token } = await res.json();
        const decoded = decode(token);
        const payload = decoded.payload as AuthPayload;
        assert.strictEqual(payload.username, username);
        assert.strictEqual(payload.iat, payload.exp - 60 * 10);
    });
});
