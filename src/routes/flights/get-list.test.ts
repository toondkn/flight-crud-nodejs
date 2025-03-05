import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import { getJwt } from '../../test-utils/auth.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';
import type { Flight } from '../../schemas/flight.ts';
import type { z } from 'zod';

describe('/flights GET list', async () => {
    const { client, collections } = await createRoutesClient();
    const jwt = await getJwt(client);
    const flightCount = 5;
    const flights: (z.infer<typeof Flight> & { id: string; })[] = [];
    before(async () => {
        for (let i = 0; i < flightCount; i++) {
            const flight = await collections.flights.insertOne({
                aircraft: 'CSTRC',
                flightNumber: 'AVIO' + i,
                departure: 'LPPD',
                destination: 'LPLA',
                schedule: {
                    std: new Date().toISOString(),
                    sta: new Date().toISOString(),
                },
            });
            flights.push(flight);
        }
    });
    it('returns 200 and a list of flights', async () => {
        const res = await client.flights.$get({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.deepStrictEqual(json, flights);
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights.$get({
            header: {
                Authorization: 'Bearer fake_token',
            },
        });
        assert.strictEqual(res.status, 401);
    });
});
