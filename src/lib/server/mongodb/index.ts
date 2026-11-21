import { MongoClient, ObjectId } from "mongodb";
import type { DbCollectionsSchema } from "./schema.ts";
import type { Filter, FindOptions, UpdateFilter, AggregateOptions, UpdateOptions, Document as MongoDocument, ChangeStreamDocument, ChangeStreamOptions } from "mongodb";
export { ObjectId };

// TYPES =====
type DbCollations = keyof DbCollectionsSchema;
type QuerySelect<T> = { [K in keyof T]?: true };
type QueryOptions<ColName extends DbCollations, TSelect extends QuerySelect<DbCollectionsSchema[ColName]> = {}> = { return?: TSelect } & Omit<FindOptions, "select">;
type QueryFilter<ColName extends DbCollations> = Filter<Omit<DbCollectionsSchema[ColName], "_id">> | Partial<DbCollectionsSchema[ColName]>;
type KnownKeys<T> = { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };
type QueryUpdateFilter<ColName extends DbCollations> = Omit<KnownKeys<UpdateFilter<Omit<DbCollectionsSchema[ColName], "_id">>>, "$set"> & { $set?: Readonly<Partial<DbCollectionsSchema[ColName]>> | Record<`${Extract<keyof DbCollectionsSchema[ColName], string | number>}.${string}`, any> };
type QueryResult<T, TSelect> = keyof TSelect extends never ? T : Pick<T, keyof TSelect & keyof T>;
type DbChange<ColName extends DbCollations> = ChangeStreamDocument<DbCollectionsSchema[ColName]>;
type WatchOptions = { operations?: ("insert" | "update" | "replace" | "delete")[] } & ChangeStreamOptions;

// CREATE CLIENT
export const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
export const database = client.db();

// DB ====
export const db = new (class Database {
	private async createOne<ColName extends DbCollations>(colName: ColName, data: Omit<DbCollectionsSchema[ColName], "_id"> & { _id?: string }) {
		if (!data._id) data["_id"] = new ObjectId().toString();
		await database.collection(colName).insertOne(data as any);
		return data as Omit<DbCollectionsSchema[ColName], "_id"> & { _id: string };
	}
	private async createMany<ColName extends DbCollations>(colName: ColName, data: (Omit<DbCollectionsSchema[ColName], "_id"> & { _id?: string })[]) {
		for (const object of data) {
			if (!object._id) object["_id"] = new ObjectId().toString();
		}
		await database.collection(colName).insertMany(data as any);
		return data as (Omit<DbCollectionsSchema[ColName], "_id"> & { _id: string })[];
	}
	private async findOne<ColName extends DbCollations, TSelect extends QuerySelect<DbCollectionsSchema[ColName]> = {}>(colName: ColName, filter?: QueryFilter<ColName>, options: QueryOptions<ColName, TSelect> = {} as QueryOptions<ColName, TSelect>): Promise<QueryResult<DbCollectionsSchema[ColName], TSelect> | null> {
		if (options.return) options.projection = options.return;
		return database.collection(colName).findOne(filter as any, options) as any;
	}
	private async findMany<ColName extends DbCollations, TSelect extends QuerySelect<DbCollectionsSchema[ColName]> = {}>(colName: ColName, filter?: QueryFilter<ColName>, options: QueryOptions<ColName, TSelect> = {} as QueryOptions<ColName, TSelect>): Promise<QueryResult<DbCollectionsSchema[ColName], TSelect>[]> {
		if (options.return) options.projection = options.return;
		return database
			.collection(colName)
			.find(filter as any, options)
			.toArray() as any;
	}
	private async aggregate<ColName extends DbCollations, Result = DbCollectionsSchema[ColName]>(colName: ColName, pipeline: MongoDocument[], options?: AggregateOptions): Promise<Result[]> {
		// @ts-ignore
		return database.collection<DbCollectionsSchema[ColName]>(colName).aggregate<Result>(pipeline, options).toArray();
	}
	private async findOneById<ColName extends DbCollations, TSelect extends QuerySelect<DbCollectionsSchema[ColName]> = {}>(colName: ColName, id: DbCollectionsSchema[ColName]["_id"], options: QueryOptions<ColName, TSelect> = {} as QueryOptions<ColName, TSelect>): Promise<QueryResult<DbCollectionsSchema[ColName], TSelect> | null> {
		return database.collection(colName).findOne({ _id: id } as any, options) as any;
	}
	private async deleteOne<ColName extends DbCollations>(colName: ColName, filter: QueryFilter<ColName>) {
		return database.collection(colName).deleteOne(filter as any);
	}
	private async deleteMany<ColName extends DbCollations>(colName: ColName, filter: QueryFilter<ColName>) {
		return database.collection(colName).deleteMany(filter as any);
	}
	private async updateOne<ColName extends DbCollations>(colName: ColName, filter: QueryFilter<ColName>, data: QueryUpdateFilter<ColName>, options?: UpdateOptions) {
		return database.collection(colName).updateOne(filter as any, data as any, options);
	}
	private async updateOneById<ColName extends DbCollations>(colName: ColName, id: string, data: QueryUpdateFilter<ColName>, options?: UpdateOptions) {
		return database.collection(colName).updateOne({ _id: id as any }, data as any, options);
	}
	private async deleteOneById<ColName extends DbCollations>(colName: ColName, id: string) {
		return database.collection(colName).deleteOne({ _id: id as any });
	}
	private async updateMany<ColName extends DbCollations>(colName: ColName, filter: QueryFilter<ColName>, data: QueryUpdateFilter<ColName>, options?: UpdateOptions) {
		return database.collection(colName).updateMany(filter as any, data as any, options);
	}
	/** Watch changes in a collection, optionally only documents matching a top-level filter */
	private watchMany<ColName extends DbCollations>(colName: ColName, filter?: QueryFilter<ColName>, options: WatchOptions = {}) {
		const { operations = ["insert", "update", "replace", "delete"], ...streamOptions } = options;
		const match: MongoDocument = { operationType: { $in: operations } };
		// Prefix filter fields with `fullDocument.` so they match the changed document (deletes have no fullDocument, so a filter skips them).
		for (const [key, value] of Object.entries(filter ?? {})) match[key.startsWith("$") ? key : `fullDocument.${key}`] = value;
		return database.collection<DbCollectionsSchema[ColName]>(colName).watch<DbCollectionsSchema[ColName], DbChange<ColName>>([{ $match: match }], { fullDocument: "updateLookup", ...streamOptions });
	}
	/** Watch changes to one document by _id, including its delete */
	private watchOneById<ColName extends DbCollations>(colName: ColName, id: string, options: WatchOptions = {}) {
		const { operations = ["insert", "update", "replace", "delete"], ...streamOptions } = options;
		return database.collection<DbCollectionsSchema[ColName]>(colName).watch<DbCollectionsSchema[ColName], DbChange<ColName>>([{ $match: { operationType: { $in: operations }, "documentKey._id": id } }], { fullDocument: "updateLookup", ...streamOptions });
	}
	//<COLLECTIONS>
    createAppData = (data: Omit<DbCollectionsSchema["appData"], "_id"> & { _id?:string}) => this.createOne<"appData">("appData", data);
	findAppData = (filter?: QueryFilter<"appData">, options?: QueryOptions<"appData">) => this.findOne<"appData">("appData", filter, options);
	updateAppData = (filter: QueryFilter<"appData">, data: QueryUpdateFilter<"appData">, options?: UpdateOptions) => this.updateOne<"appData">("appData", filter, data, options);
	watchAppData = (options?: WatchOptions) => this.watchMany<"appData">("appData", undefined, options);
    createUser = (data: Omit<DbCollectionsSchema["user"], "_id"> & { _id?:string}) => this.createOne<"user">("user", data);
	createUsers = (data: (Omit<DbCollectionsSchema["user"], "_id"> & { _id?:string})[]) => this.createMany<"user">("user", data);
	findUser = (filter?: QueryFilter<"user">, options?: QueryOptions<"user">) => this.findOne<"user">("user", filter, options);
	findUsers = (filter?: QueryFilter<"user">, options?: QueryOptions<"user">) => this.findMany<"user">("user", filter, options);
	findUserById = (id: DbCollectionsSchema["user"]["_id"], options?: QueryOptions<"user">) => this.findOneById<"user">("user", id, options);
	userAggregate = <Result = DbCollectionsSchema["user"]>(pipeline: MongoDocument[], options?: AggregateOptions) => this.aggregate<"user", Result>("user", pipeline, options);
	deleteUser = (filter: QueryFilter<"user">) => this.deleteOne<"user">("user", filter);
	deleteUsers = (filter: QueryFilter<"user">) => this.deleteMany<"user">("user", filter);
	deleteUserById = (id: string) => this.deleteOneById<"user">("user", id);
	updateUser = (filter: QueryFilter<"user">, data: QueryUpdateFilter<"user">, options?: UpdateOptions) => this.updateOne<"user">("user", filter, data, options);
	updateUsers = (filter: QueryFilter<"user">, data: QueryUpdateFilter<"user">, options?: UpdateOptions) => this.updateMany<"user">("user", filter, data, options);
	updateUserById = (id: string, data: QueryUpdateFilter<"user">, options?: UpdateOptions) => this.updateOneById<"user">("user", id, data, options);
	watchUser = (filter?: QueryFilter<"user">, options?: WatchOptions) => this.watchMany<"user">("user", filter, options);
	watchUserById = (id: string, options?: WatchOptions) => this.watchOneById<"user">("user", id, options);
    createSession = (data: Omit<DbCollectionsSchema["session"], "_id"> & { _id?:string}) => this.createOne<"session">("session", data);
	createSessions = (data: (Omit<DbCollectionsSchema["session"], "_id"> & { _id?:string})[]) => this.createMany<"session">("session", data);
	findSession = (filter?: QueryFilter<"session">, options?: QueryOptions<"session">) => this.findOne<"session">("session", filter, options);
	findSessions = (filter?: QueryFilter<"session">, options?: QueryOptions<"session">) => this.findMany<"session">("session", filter, options);
	findSessionById = (id: DbCollectionsSchema["session"]["_id"], options?: QueryOptions<"session">) => this.findOneById<"session">("session", id, options);
	sessionAggregate = <Result = DbCollectionsSchema["session"]>(pipeline: MongoDocument[], options?: AggregateOptions) => this.aggregate<"session", Result>("session", pipeline, options);
	deleteSession = (filter: QueryFilter<"session">) => this.deleteOne<"session">("session", filter);
	deleteSessions = (filter: QueryFilter<"session">) => this.deleteMany<"session">("session", filter);
	deleteSessionById = (id: string) => this.deleteOneById<"session">("session", id);
	updateSession = (filter: QueryFilter<"session">, data: QueryUpdateFilter<"session">, options?: UpdateOptions) => this.updateOne<"session">("session", filter, data, options);
	updateSessions = (filter: QueryFilter<"session">, data: QueryUpdateFilter<"session">, options?: UpdateOptions) => this.updateMany<"session">("session", filter, data, options);
	updateSessionById = (id: string, data: QueryUpdateFilter<"session">, options?: UpdateOptions) => this.updateOneById<"session">("session", id, data, options);
	watchSession = (filter?: QueryFilter<"session">, options?: WatchOptions) => this.watchMany<"session">("session", filter, options);
	watchSessionById = (id: string, options?: WatchOptions) => this.watchOneById<"session">("session", id, options);
    //</COLLECTIONS>
})();
