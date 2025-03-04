import { Hono } from 'hono';
import { database } from '../mongo/database.js';
import { MongoStrictCollection } from '../mongo/mongo-strict-collection.js';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { HTTPException } from 'hono/http-exception';

const someEntitySchema = z.object({
    name: z.string(),
});

const someEntityCollection = new MongoStrictCollection(database.collection('someEntity'), someEntitySchema);

const someEntityRouter = new Hono();

// TODO: validate route parameters
someEntityRouter.get('/:id', async c => {
    const id = new ObjectId(c.req.param('id'));
    const someEntity = await someEntityCollection.findById(id);
    if (someEntity === null)
        throw new HTTPException(404);
    return c.json(someEntity);
});

export { someEntityRouter };
