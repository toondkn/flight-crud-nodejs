import { decode } from 'hono/jwt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import assert from 'node:assert/strict';
import test, { after, describe } from 'node:test';
import { createTestClient } from '../../test-utils/test-client.ts';
import type { AuthPayload } from './post.ts';

describe('/auth POST', async () => {
    const mongod = await MongoMemoryServer.create();
    const testClient = createTestClient(mongod);
    test('posting incorrect hardcoded credentials returns 400', async () => {
        const res = await testClient.client.auth.$post({
            json: {
                username: 'invalid_username',
                password: 'invalid_password',
            },
        });
        assert.strictEqual(res.status, 400);
    });
    test('posting hardcoded credentials returns 200, jwt with payload', async () => {
        const username = 'aviobook';
        const password = 'assessment';
        const res = await testClient.client.auth.$post({
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
    after(async () => {
        await testClient.cleanup();
        await mongod.stop();
    });
});
