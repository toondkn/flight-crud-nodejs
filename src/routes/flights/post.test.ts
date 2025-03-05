import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { z } from 'zod';
import type { Flight } from '../../schemas/flight.ts';
import { getJwt } from '../../test-utils/auth.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights POST', async () => {
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
    it('returns 201 and the created flight, flight is added to collection', async () => {
        const res = await client.flights.$post({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 201);
        const json = await res.json();
        assert.partialDeepStrictEqual(json, flightData);
        const persistedFlight = await collections.flights.findOne(json.id);
        assert.deepStrictEqual(persistedFlight, json);
    });
    it('returns 400 when json body fails validation', async () => {
        const res = await client.flights.$post({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            json: {
                ...flightData,
                aircraft: 'AVIOOOOOOOO',
            },
        });
        assert.strictEqual(res.status, 400);
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights.$post({
            header: {
                Authorization: 'Bearer fake_token',
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 401);
    });
});
