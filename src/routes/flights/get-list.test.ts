import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { getJwt } from '../../test-utils/auth.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights GET list', async () => {
    const { client, collections } = await createRoutesClient();
    const flightCount = 5;
    before(async () => {
        for (let i = 0; i < flightCount; i++)
            await collections.flights.insertOne({
                aircraft: 'CSTRC',
                flightNumber: 'AVIO' + i,
                departure: 'LPPD',
                destination: 'LPLA',
                schedule: {
                    std: new Date().toISOString(),
                    sta: new Date().toISOString(),
                },
            });
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights.$get({
            header: {
                Authorization: 'Bearer fake_token',
            },
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 200 and a list of flights', async () => {
        const jwt = await getJwt(client);
        const res = await client.flights.$get({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.length, flightCount);
    });
});
