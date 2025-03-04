import { decode } from 'hono/jwt';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { client } from '../../test-utils/client.ts';

describe('/auth POST', () => {
    test('posting incorrect hardcoded credentials returns 400', async () => {
        const res = await client.auth.$post({
            json: {
                username: 'invalid_username',
                password: 'invalid_password',
            },
        });
        assert.strictEqual(res.status, 400);
    });
    test('posting hardcoded credentials returns 200, jwt with username payload', async () => {
        const res = await client.auth.$post({
            json: {
                username: 'aviobook',
                password: 'assessment',
            },
        });
        assert.strictEqual(res.status, 200);
        const { token } = await res.json();
        const { payload } = decode(token);
        assert.deepEqual(payload, { username: 'aviobook' });
    });
});
