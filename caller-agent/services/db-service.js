const { MongoClient, ObjectId } = require('mongodb');

class DbService {
	constructor() {
		this.client = null;
		this.db = null;
		this.connect();
	}

	async connect() {
		try {
			const uri = process.env.MONGODB_URI;
			this.client = new MongoClient(uri);
			await this.client.connect();
			this.db = this.client.db(process.env.MONGODB_DB_NAME);
			console.log('Connected to MongoDB');
		} catch (error) {
			console.error('Error connecting to MongoDB:', error);
			throw error;
		}
	}

	// Create a new document in a collection
	async create(collection, data) {
		try {
			const result = await this.db.collection(collection).insertOne(data);
			console.log('Document inserted with ID:', result.insertedId);
			return result.insertedId;
		} catch (error) {
			console.error('Error adding document:', error);
			throw error;
		}
	}

	// Read a document from a collection
	async read(collection, id) {
		try {
			const doc = await this.db
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

	// Update a document in a collection
	async update(collection, query, update) {
		try {
			const updateOperation = {};
			if (update.$addToSet) {
				updateOperation.$addToSet = update.$addToSet;
				delete update.$addToSet;
			}
			if (Object.keys(update).length > 0) {
				updateOperation.$set = update;
			}
			const result = await this.db
				.collection(collection)
				.updateOne(query, updateOperation);
			return result;
		} catch (error) {
			console.error('Error updating document:', error);
			throw error;
		}
	}

	// Delete a document from a collection
	async delete(collection, id) {
		try {
			const result = await this.db
				.collection(collection)
				.deleteOne({ _id: new ObjectId(id) });
			console.log('Document successfully deleted');
			return result.deletedCount > 0;
		} catch (error) {
			console.error('Error removing document:', error);
			throw error;
		}
	}

	async findOne(collection, query) {
		await this.connect();
		return this.db.collection(collection).findOne(query);
	}

	// Query documents in a collection
	async query(collection, conditions) {
		try {
			const query = conditions.reduce((acc, condition) => {
				acc[condition.field] = {
					[this.getOperator(condition.operator)]: condition.value,
				};
				return acc;
			}, {});

			const cursor = this.db.collection(collection).find(query);
			return await cursor.toArray();
		} catch (error) {
			console.error('Error querying documents:', error);
			throw error;
		}
	}

	getOperator(operator) {
		const operatorMap = {
			'==': '$eq',
			'!=': '$ne',
			'>': '$gt',
			'>=': '$gte',
			'<': '$lt',
			'<=': '$lte',
		};
		return operatorMap[operator] || '$eq';
	}
}

module.exports = new DbService();
