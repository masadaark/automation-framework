export interface AppSettingModel {
  baseUrl: string;
  headers: string;
  pgDB: PgConfig;
}

export interface PgConfig {
  user: string;
  password: string;
  database: string;
  host: string;
  port: number;
}
