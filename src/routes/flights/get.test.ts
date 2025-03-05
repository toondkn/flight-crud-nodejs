import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { z } from 'zod';
import type { Flight } from '../../schemas/flight.ts';
import { getJwt } from '../../test-utils/auth.ts';
import { fakeObjectIdStr } from '../../test-utils/mongo.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights GET', async () => {
    const { client, collections } = await createRoutesClient();
    const jwt = await getJwt(client);
    const flightData: z.infer<typeof Flight> = {
        aircraft: 'AVIO',
        flightNumber: 'AVIO1',
        schedule: {
            std: new Date().toISOString(),
            sta: new Date().toISOString(),
        },
        departure: 'AVIO',
        destination: 'IVAO',
    };
    const flightId = await collections.flights.insertOne(flightData);
    it('returns 200 and the flight', async () => {
        const res = await client.flights[':flightId'].$get({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId,
            },
        });
        assert.strictEqual(res.status, 200);
        const flight = await res.json();
        assert.partialDeepStrictEqual(flight, flightData);
        ;
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights[':flightId'].$get({
            header: {
                Authorization: 'Bearer fake_token',
            },
            param: {
                flightId,
            },
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 404 when the flight is not found', async () => {
        const res = await client.flights[':flightId'].$get({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: fakeObjectIdStr,
            },
        });
        assert.strictEqual(res.status, 404);
    });
});
