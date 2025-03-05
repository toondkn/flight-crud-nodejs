import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { z } from 'zod';
import type { Flight } from '../../schemas/flight.ts';
import { getJwt } from '../../test-utils/auth.ts';
import { createRoutesClient } from '../../test-utils/routes.ts';

describe('/flights PATCH', async () => {
    const { client, collections } = await createRoutesClient();
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
    it('returns 200, the updated flight, and the flight is updated in the collection', async () => {
        const jwt = await getJwt(client);
        const updatedFlightData = {
            ...flightData,
            aircraft: 'AVIO-UPD',
        };
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId,
            },
            json: updatedFlightData,
        });
        assert.strictEqual(res.status, 200);
        const flight = await res.json();
        assert.partialDeepStrictEqual(flight, updatedFlightData);
        const updatedPersistedFlight = await collections.flights.findById(flightId);
        assert.deepStrictEqual(updatedPersistedFlight, updatedFlightData);
    });
    it('returns 400 when received data is not valid', async () => {
        const jwt = await getJwt(client);
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId,
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
                flightId: 'fake_id',
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 401);
    });
    it('returns 404 when the flight is not found', async () => {
        const jwt = await getJwt(client);
        const res = await client.flights[':flightId'].$patch({
            header: {
                Authorization: `Bearer ${jwt}`,
            },
            param: {
                flightId: 'fake_id',
            },
            json: flightData,
        });
        assert.strictEqual(res.status, 404);
    });
});
