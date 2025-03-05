import { ObjectId, type Collection, type Db, type Document } from 'mongodb';
import type { ZodArray, ZodType } from 'zod';

class DocumentIdNotFoundError extends Error { }

type WithRealId<T> = T & { id: string; }

/** Single-source-of-truth typing and runtime validation of input and output of a MongoDB collection. */
export class MongoStrictCollection<T extends Document> {
    private collection: Collection;
    private schema: ZodType<T>;
    private schemaAll: ZodArray<ZodType<T>>;

    constructor(
        database: Db,
        collectionName: string,
        schema: ZodType<T>,
    ) {
        this.collection = database.collection(collectionName);
        this.schema = schema;
        this.schemaAll = this.schema.array();
    }

    async insertOne(data: T): Promise<WithRealId<T>> {
        const parsed = this.schema.parse(data);
        // insertOne() mutates the input object by adding _id
        const result = await this.collection.insertOne(parsed);
        delete parsed._id;
        const id = result.insertedId.toString();
        return { id, ...parsed };
    }

    async replaceOne(id: string, data: T): Promise<WithRealId<T>> {
        const parsed = this.schema.parse(data);
        const result = await this.collection.replaceOne({ _id: new ObjectId(id) }, parsed);
        if (result.matchedCount === 0)
            throw new DocumentIdNotFoundError();
        return { id, ...parsed };
    }

    async deleteOne(id: string) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
            throw new DocumentIdNotFoundError();
    }

    async findOne(id: string): Promise<WithRealId<T>> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (result === null)
            throw new DocumentIdNotFoundError();
        const parsed = this.schema.parse(result);
        return { id, ...parsed };
    }

    async findAll(): Promise<WithRealId<T>[]> {
        // TODO: investigate streaming responses to reduce memory load?
        const results = await this.collection.find().toArray();
        const parsed = this.schemaAll.parse(results);
        return parsed.map((p, i) => ({
            ...p,
            id: results[i]._id.toString(),
        }));
    }
}
