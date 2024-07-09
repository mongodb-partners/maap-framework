import { MongoClient } from "mongodb";

export class MongoDBCrud {
    private readonly connectionString: string;
    private readonly dbName: string;
    private readonly collectionName: string;
    private client: MongoClient;
    private collection: any;

    constructor({ connectionString, dbName, collectionName }: { connectionString: string; dbName: string; collectionName: string; }
    ) {
        this.connectionString = connectionString;
        this.dbName = dbName;
        this.collectionName = collectionName;
        
    }

    async init() {
        this.client = new MongoClient(this.connectionString);
        
    }

    async aggregate(query: any[]): Promise<any[]> {
        try {
            this.init();
            this.collection = this.client.db(this.dbName).collection(this.collectionName);
            return this.collection.aggregate(query).toArray();
        } finally {
            await this.client.close();
        }
    }
}