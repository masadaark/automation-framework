export interface PgDBFileModel {
  sql: string;
  scenarios: ScenarioPgDB[];
}

export interface ScenarioPgDB {
  paramReplace?: Record<string, string | number>;
  tcNo: number[];
  expect?: Record<string, any>[];
}
