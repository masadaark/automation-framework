export interface AppSettingModel {
  baseUrl: string;
  headers: Record<string, any>;
  pgDB: PgConfig;
  wiremockUrl: string;
  mongoDB: MongoDBConfig;
}

export interface PgConfig {
  user: string;
  password: string;
  database: string;
  host: string;
  port: number;
}
export interface MongoDBConfig {
  url: string;
  dbName: string;
}
