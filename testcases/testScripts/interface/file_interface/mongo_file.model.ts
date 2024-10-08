export interface MongoCollection {
  dbName?: string;
  collectionName: string;
  data: Record<string, any>[];
}
