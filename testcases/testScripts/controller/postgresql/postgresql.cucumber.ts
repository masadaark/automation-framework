import { binding, given, when } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import PgLogic from '../../logic/sql/pg_sql.logic';
import PgProtocol from '../../protocol/pg.protocol';
import { DataTable } from '@cucumber/cucumber';
import Formatter from '../../class/formatter.class';
import File from '../../util/file.util';

@binding()
export class PostgresqlController {
  @when('StepDef.{string} fileName.{string} Postgres query', { timeout: Cfg.stepTimeOut })
  public async PgQueryJsonFileWithComment(_des: string, file: string): Promise<void> {
    await PgLogic.Exec(file);
  }
  @when('{string} Postgres query', { timeout: Cfg.stepTimeOut })
  public async PgQueryJsonFile(file: string): Promise<void> {
    await PgLogic.Exec(file);
  }
  @given('Truncate Table {string}.{string}', { timeout: Cfg.stepTimeOut })
  public async TruncateTable(schema: string, table: string): Promise<void> {
    await PgProtocol.Query(`TRUNCATE TABLE ${schema}.${table}  RESTART IDENTITY CASCADE ;`);
  }
  @given('Truncate Tables', { timeout: Cfg.stepTimeOut })
  public async TruncateTables(bddTable: DataTable): Promise<void> {
    await PgProtocol.Query(
      Formatter.Exec(bddTable.hashes()).reduce(
        (acc: string, row: Record<string, any>) => `${acc} 
        TRUNCATE TABLE ${row['schemaName']}.${row['tableName']} 
        RESTART IDENTITY CASCADE ;`,
        ''
      )
    );
  }
  @given('Insert data {string}.{string}', { timeout: Cfg.stepTimeOut })
  public async InsertData(schema: string, table: string, bddTable: DataTable): Promise<void> {
    const tablePath: string = ` ${schema}.${table}`;
    const sqlValues: string = Formatter.Exec(bddTable['rawTable'].slice(1))
      .map((row: string[]) => PgLogic.FormatSqlVal(row))
      .join(',');
    await PgProtocol.Query(`INSERT INTO ${tablePath} (${bddTable['rawTable'][0].join(',')}) VALUES ${sqlValues};
        SELECT setval(pg_get_serial_sequence('${tablePath}', 'id'), coalesce(MAX(id), 1))
        from ${tablePath};`);
    PgLogic.addTableList(tablePath);
  }
  @given('Truncate inserted table', { timeout: Cfg.stepTimeOut })
  public async TruncateInsertedTable(): Promise<void> {
    await PgProtocol.Query(
      PgLogic.tableList.map((table) => `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE ;`).join('\n')
    );
    PgLogic.tableList = [];
  }
  @given('Insert from sql: {string}', { timeout: Cfg.stepTimeOut })
  @given('Exec sql: {string}', { timeout: Cfg.stepTimeOut })
  @given('Pg Exec {string}', { timeout: Cfg.stepTimeOut })
  public async InsertFromSql(file: string): Promise<void> {
    const fileText: string = await File.readText(`payloads/sql/${file}`);
    await PgProtocol.Query(fileText);
  }
}
