export interface AppSettingModel {
  baseUrl: string;
  headers: Record<string, any>;
  pgDB: PgConfig;
  wiremockUrl: string;
  mongoDB: MongoDBConfig;
  aws: AwsConfig;
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

export interface AwsConfig {
  s3: string;
}
