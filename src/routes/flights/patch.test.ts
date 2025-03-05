import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { z } from 'zod';
import type { Flight } from '../../schemas/flight.ts';
import { getJwt } from '../../test-utils/auth.ts';
import { fakeObjectIdStr } from '../../test-utils/mongo.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights PATCH', async () => {
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
    it('returns 200 and the updated flight, flight is updated in the collection', async () => {
        const updatedFlightData = {
            ...flightData,
            aircraft: 'AVIO-UPD',
        };
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: flight.id,
            },
            json: updatedFlightData,
        });
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.partialDeepStrictEqual(json, updatedFlightData);
        const updatedPersistedFlight = await collections.flights.findOne(flight.id);
        assert.deepStrictEqual(updatedPersistedFlight, json);
    });
    it('returns 400 when received data is not valid', async () => {
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: flight.id,
            },
            json: {
                ...flightData,
                // too long to pass validation
                aircraft: 'AVIOOOOOOOOOO',
            },
        });
        assert.strictEqual(res.status, 400);
    });
    it('returns 401 when jwt is invalid', async () => {
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: 'Bearer fake_token',
            },
            param: {
                flightId: flight.id,
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 404 when the flight is not found', async () => {
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: fakeObjectIdStr,
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 404);
    });
});
