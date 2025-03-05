import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { z } from 'zod';
import type { Flight } from '../../schemas/flight.ts';
import { getJwt } from '../../test-utils/auth.ts';
import { fakeObjectIdStr } from '../../test-utils/mongo.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights DELETE', async () => {
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
    const flight = await collections.flights.insertOne(flightData);
    it('returns 204 and the flight is removed from the collection', async () => {
        const res = await client.flights[':flightId'].$delete({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: flight.id,
            },
        });
        assert.strictEqual(res.status, 204);
        assert.rejects(collections.flights.findOne(flight.id));
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights[':flightId'].$delete({
            header: {
                Authorization: 'Bearer fake_token',
            },
            param: {
                flightId: flight.id,
            },
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 404 when the flight is not found', async () => {
        const res = await client.flights[':flightId'].$delete({
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
