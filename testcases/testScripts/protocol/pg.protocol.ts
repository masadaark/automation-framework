import { Pool } from 'pg';
import StorageLogic from '../logic/storage/storage.logic';
import ResClass from '../class/response.class';
import IndianReportLogic from '../logic/report.logic';
import { PgConfig } from '../interface/app_setting.model';

class ProtocolPg {
  private static _pool: Pool;

  static Connect(cfg: PgConfig): void {
    this._pool = new Pool({
      ...cfg,
      max: 10,
      connectionTimeoutMillis: 1000,
      idleTimeoutMillis: 1000,
    });
  }
  static async Query(sql: string): Promise<void> {
    try {
      const queryResult = (await this._pool.query(StorageLogic.RepStrVar(sql))).rows;
      ResClass.Query = queryResult;
      IndianReportLogic.AddTestStep({
        pgQuery: sql,
        result: queryResult,
      });
      return;
    } catch (err) {
      throw new Error(`err: ${err} SQL: ${sql}`);
    }
  }
}

export default ProtocolPg;
