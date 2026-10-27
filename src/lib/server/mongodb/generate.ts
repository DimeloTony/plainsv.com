import fs from "fs";
import { dbCollectionsSchema } from "./schema.js";
const INDEX_PATH = "src/lib/server/mongodb/index.ts";
const dbData = fs.readFileSync(INDEX_PATH).toString();

/** Generate types from schemas */
const getMethods = (col: string, colCapitalized: string) => {
	// If collection starts with `app`: only create `createCol` method
	if (col.startsWith("app")) {
		return `\n    create${colCapitalized} = (data: Omit<DbCollectionsSchema["${col}"], "_id"> & { _id?:string}) => this.createOne<"${col}">("${col}", data);
	find${colCapitalized} = (filter?: QueryFilter<"${col}">, options?: QueryOptions<"${col}">) => this.findOne<"${col}">("${col}", filter, options);
	update${colCapitalized} = (filter: QueryFilter<"${col}">, data: QueryUpdateFilter<"${col}">) => this.updateOne<"${col}">("${col}", filter, data);`;
	}

	// Else: Create all methods
	return `\n    create${colCapitalized} = (data: Omit<DbCollectionsSchema["${col}"], "_id"> & { _id?:string}) => this.createOne<"${col}">("${col}", data);
	create${colCapitalized}s = (data: (Omit<DbCollectionsSchema["${col}"], "_id"> & { _id?:string})[]) => this.createMany<"${col}">("${col}", data);
	find${colCapitalized} = (filter?: QueryFilter<"${col}">, options?: QueryOptions<"${col}">) => this.findOne<"${col}">("${col}", filter, options);
	find${colCapitalized}s = (filter?: QueryFilter<"${col}">, options?: QueryOptions<"${col}">) => this.findMany<"${col}">("${col}", filter, options);
	find${colCapitalized}ById = (id: DbCollectionsSchema["${col}"]["_id"], options?: QueryOptions<"${col}">) => this.findOneById<"${col}">("${col}", id, options);
	${col}Aggregate = <Result = DbCollectionsSchema["${col}"]>(pipeline: MongoDocument[], options?: AggregateOptions) => this.aggregate<"${col}", Result>("${col}", pipeline, options);
	delete${colCapitalized} = (filter: QueryFilter<"${col}">) => this.deleteOne<"${col}">("${col}", filter);
	delete${colCapitalized}s = (filter: QueryFilter<"${col}">) => this.deleteMany<"${col}">("${col}", filter);
	delete${colCapitalized}ById = (id: ${col.startsWith("app") ? 'DbCollectionsSchema["appData"]["_id"]' : "string"}) => this.deleteOneById<"${col}">("${col}", id);
	update${colCapitalized} = (filter: QueryFilter<"${col}">, data: QueryUpdateFilter<"${col}">) => this.updateOne<"${col}">("${col}", filter, data);
	update${colCapitalized}s = (filter: QueryFilter<"${col}">, data: QueryUpdateFilter<"${col}">) => this.updateMany<"${col}">("${col}", filter, data);
	update${colCapitalized}ById = (id: ${col.startsWith("app") ? 'DbCollectionsSchema["appData"]["_id"]' : "string"}, data: QueryUpdateFilter<"${col}">) => this.updateOneById<"${col}">("${col}", id, data);`;
};

const generateMethods = () => {
	let result: string = "";
	// loop all collections and create methods
	for (const collection of Object.keys(dbCollectionsSchema)) {
		// skip
		if (collection === "dbCollectionsSchema") continue;
		// generate
		const capitalizedCol = collection.charAt(0).toUpperCase() + collection.slice(1);
		result += getMethods(collection, capitalizedCol);
	}
	return result;
};

const methods = generateMethods();
const oldData = `//<COLLECTIONS>${dbData.split("//<COLLECTIONS>")[1].split("//</COLLECTIONS>")[0]}//</COLLECTIONS>`;
const newData = `//<COLLECTIONS>${methods}\n    //</COLLECTIONS>`;
fs.writeFileSync(INDEX_PATH, dbData.replace(oldData, newData));

console.log(`Generated db at ${new Date()}`);
