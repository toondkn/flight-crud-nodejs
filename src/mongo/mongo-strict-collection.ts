import type { Collection, Db, Document, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import type { ZodArray, ZodType } from 'zod';

/** Single-source-of-truth typing and runtime validation of input and output of a MongoDB collection. */
export class MongoStrictCollection<S extends Document> {
    private collection: Collection;
    private schema: ZodType<S>;
    private schemaAll: ZodArray<ZodType<S>>;

    constructor(
        database: Db,
        collectionName: string,
        schema: ZodType<S>,
    ) {
        this.collection = database.collection(collectionName);
        this.schema = schema;
        this.schemaAll = this.schema.array();
    }

    async insertOne(data: S): Promise<string> {
        const parsed = this.schema.parse(data);
        const result = await this.collection.insertOne(parsed);
        return result.insertedId.toString();
    }

    async findById(id: string): Promise<S | null> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return this.schema.parse(result);
    }

    async findAll(): Promise<S[]> {
        const results = await this.collection.find().toArray();
        return this.schemaAll.parse(results);
    }
}
