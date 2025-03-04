import type { Collection, Document, ObjectId, OptionalUnlessRequiredId } from 'mongodb';
import type { z, ZodArray, ZodType } from 'zod';

/** Single-source-of-truth typing and runtime validation of input and output of a MongoDB collection. */
export class MongoStrictCollection<S extends Document> {
    private schemaAll: ZodArray<ZodType<S>>;

    constructor(
        private collection: Collection<z.infer<ZodType<S>>>,
        private schema: ZodType<S>,
    ) {
        this.schemaAll = this.schema.array();
    }

    async insertOne(data: S): Promise<ObjectId> {
        const parsed = this.schema.parse(data) as OptionalUnlessRequiredId<S>;
        const result = await this.collection.insertOne(parsed);
        return result.insertedId;
    }

    async findById(id: OptionalUnlessRequiredId<S>['_id']): Promise<S | null> {
        const result = await this.collection.findOne({ _id: id });
        return this.schema.parse(result);
    }

    async findAll(): Promise<S[]> {
        const results = await this.collection.find().toArray();
        return this.schemaAll.parse(results);
    }
}
