import { MongoMemoryServer } from 'mongodb-memory-server';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { getJwt } from '../../test-utils/jwt.ts';
import { createTestClient } from '../../test-utils/test-client.ts';

describe('/flights GET', async () => {
    const mongod = await MongoMemoryServer.create();
    const testClient = createTestClient(mongod);
    const flightCount = 5;
    before(async () => {
        for (let i = 0; i < flightCount; i++)
            await testClient.collections.flights.insertOne({
                aircraft: 'CSTRC',
                flightNumber: 'AVIO' + i,
                departure: 'LPPD',
                destination: 'LPLA',
                schedule: {
                    std: new Date(),
                    sta: new Date(),
                },
            });
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await testClient.client.flights.$get({
            header: {
                Authorization: 'Bearer fake_token',
            },
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 200 and a list of flights', async () => {
        const jwt = await getJwt(testClient.client);
        const res = await testClient.client.flights.$get({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.length, flightCount);
    });
    after(async () => {
        await testClient.cleanup();
        await mongod.stop();
    });
});
