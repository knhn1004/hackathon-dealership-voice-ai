import { MongoClient, Db, ObjectId } from 'mongodb';

class DbService {
	private client: MongoClient | null = null;
	private db: Db | null = null;

	constructor() {
		this.connect();
	}

	async connect() {
		try {
			const uri = process.env.MONGODB_URI;
			if (!uri) {
				throw new Error(
					'MONGODB_URI is not defined in the environment variables'
				);
			}
			this.client = new MongoClient(uri);
			await this.client.connect();
			this.db = this.client.db(process.env.MONGODB_DB_NAME);
			console.log('Connected to MongoDB');
		} catch (error) {
			console.error('Error connecting to MongoDB:', error);
			throw error;
		}
	}

	getDb(): Db {
		if (!this.db) {
			throw new Error('Database not connected. Call connect() first.');
		}
		return this.db;
	}

	async create(collection: string, data: any) {
		try {
			const result = await this.getDb().collection(collection).insertOne(data);
			console.log('Document inserted with ID:', result.insertedId);
			return result.insertedId;
		} catch (error) {
			console.error('Error adding document:', error);
			throw error;
		}
	}

	async read(collection: string, id: string) {
		try {
			const doc = await this.getDb()
				.collection(collection)
				.findOne({ _id: new ObjectId(id) });
			if (!doc) {
				console.log('No such document!');
				return null;
			}
			return doc;
		} catch (error) {
			console.error('Error getting document:', error);
			throw error;
		}
	}

	async update(collection: string, query: any, update: any) {
		try {
			const updateOperation: any = {};
			if (update.$addToSet) {
				updateOperation.$addToSet = update.$addToSet;
				delete update.$addToSet;
			}
			if (Object.keys(update).length > 0) {
				updateOperation.$set = update;
			}
			const result = await this.getDb()
				.collection(collection)
				.updateOne(query, updateOperation);
			return result;
		} catch (error) {
			console.error('Error updating document:', error);
			throw error;
		}
	}

	async delete(collection: string, id: string) {
		try {
			const result = await this.getDb()
				.collection(collection)
				.deleteOne({ _id: new ObjectId(id) });
			console.log('Document successfully deleted');
			return result.deletedCount > 0;
		} catch (error) {
			console.error('Error removing document:', error);
			throw error;
		}
	}

	async findOne(collection: string, query: any) {
		return this.getDb().collection(collection).findOne(query);
	}

	async query(collection: string, conditions: any[]) {
		try {
			const query = conditions.reduce((acc: any, condition: any) => {
				acc[condition.field] = {
					[this.getOperator(condition.operator)]: condition.value,
				};
				return acc;
			}, {});

			const cursor = this.getDb()
				.collection(collection)
				.find(query)
				.sort({ createdAt: -1 });
			return await cursor.toArray();
		} catch (error) {
			console.error('Error querying documents:', error);
			throw error;
		}
	}

	private getOperator(operator: string): string {
		const operatorMap: { [key: string]: string } = {
			'==': '$eq',
			'!=': '$ne',
			'>': '$gt',
			'>=': '$gte',
			'<': '$lt',
			'<=': '$lte',
		};
		return operatorMap[operator] || '$eq';
	}

	async findById(collection: string, id: string) {
		return this.getDb()
			.collection(collection)
			.findOne({ _id: new ObjectId(id) });
	}

	async findAll(collection: string) {
		return this.getDb().collection(collection).find().toArray();
	}
}

const dbService = new DbService();
export default dbService;
