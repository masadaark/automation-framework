import VFormatter from '../../class/formatter.class';
import ScenarioClass from '../../class/scenario.class';
import TcClass from '../../class/test_cases.class';
import { PgDBFileModel } from '../../interface/file_interface/db_file.model';
import PgProtocol from '../../protocol/pg.protocol';
import FileU from '../../util/file.util';
import Obj from '../../util/object.util';
import FileReaderLogic from '../file_reader.logic';

export default class PgLogic {
  private static _tableList: string[] = [];
  static async Exec(file: string) {
    const pgSqlFile: PgDBFileModel = await FileReaderLogic.JsonPayload(file);
    TcClass.PgDBFile = pgSqlFile;
    ScenarioClass.PgDB = ScenarioClass.NewPgDB();
    ScenarioClass.PgDB = Obj.New(Obj.FindInclude(pgSqlFile.scenarios, 'tcNo', TcClass.tcNo));
    if (!ScenarioClass.PgDB) return;
    const sql: string = ScenarioClass.PgDB.paramReplace
      ? VFormatter.PathReplace(TcClass.PgDBFile.sql, VFormatter.Exec(ScenarioClass.PgDB.paramReplace))
      : TcClass.PgDBFile.sql;
    await PgProtocol.Query(sql);
  }
  static FormatSqlVal(row: string[]): string {
    return `(${row.map((val) => (val.length ? "'" + val + "'" : 'NULL')).join(',')})`;
  }
  static get tableList(): string[] {
    return this._tableList;
  }

  static addTableList(table: string): void {
    this._tableList.push(table);
  }

  static set tableList(val: string[]) {
    this._tableList = val;
  }
}
