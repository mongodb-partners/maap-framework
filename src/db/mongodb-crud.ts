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

    public async init() {
        if(!this.client) this.client = new MongoClient(this.connectionString);
    }

    public async aggregate(query: any[]): Promise<any[]> {
        let result: any 
        try {
            this.collection = this.client.db(this.dbName).collection(this.collectionName);
            result = this.collection.aggregate(query).toArray();
        } catch(err) {
            console.error(err);
        } finally {
            // TODO : await this.client.close();
        }
        return result;
    }
}