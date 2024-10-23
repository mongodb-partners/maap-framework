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
        // console.log("MongoDB structured Query :: ", JSON.stringify(query));
        try {
            this.collection = this.client.db(this.dbName).collection(this.collectionName);
            result = await this.collection.aggregate(query).toArray();
            // console.log("MongoDB structured Query Result 1 :: ", result);
        } catch(err) {
            // console.log("Error in MongoDB structured Query :: ", err);
            console.error(err);
        }
        // console.info("MongoDB structured Query Result 2 :: ", JSON.stringify(result));
        return result;
    }
}