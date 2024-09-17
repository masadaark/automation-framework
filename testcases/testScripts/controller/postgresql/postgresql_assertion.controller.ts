import { binding, then } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import PgAssertionLogic from '../../logic/sql/pg_assertion.logic';
import ResClass from '../../class/response.class';
import ScenarioClass from '../../class/scenario.class';
import AssertionLogic from '../../logic/assertion.logic';
import { expect } from 'chai';
import StorageLogic from '../../logic/storage/storage.logic';
import VFormatter from '../../class/formatter.class';
import IndianReportLogic from '../../logic/report.logic';

@binding()
export class PostgresqlAssertionController {
  @then('Expecting query result', { timeout: Cfg.stepTimeOut })
  public PgQueryResultAssertion(): void {
    if (!ScenarioClass.PgDB?.expect) return;
    PgAssertionLogic.Version1(ResClass.Query, ScenarioClass.PgDB?.expect);
  }
  @then('Expecting jsonArray query result', { timeout: Cfg.stepTimeOut })
  public PgSubsetAssertion(): void {
    if (!ScenarioClass.PgDB?.expect) return;
    const actualResult = ResClass.Query;
    const expectedResult = VFormatter.Exec(ScenarioClass.PgDB?.expect);
    IndianReportLogic.AddTestStep({ actualResult, expectedResult });
    AssertionLogic.SubSet(actualResult, expectedResult, '');
  }
  @then('Sql response path {string} == {string}', { timeout: Cfg.stepTimeOut })
  public SqlResponsePathAssertion(path: string, val: string): void {
    if (!ScenarioClass.PgDB?.expect) return;
    const actualResult = ResClass.Query;
    AssertionLogic.Path(actualResult, path, val);
  }
  @then('Sql result path {string} length to equal {string}', { timeout: Cfg.stepTimeOut })
  public SqlResponsePathLengthAssertion(path: string, length: string): void {
    if (!ResClass.Query) return;
    const actualResult = StorageLogic.ObjPathVal(ResClass.Query, path).length;
    const expectedResult = Number(length);
    AssertionLogic.SubSet(actualResult, expectedResult, '');
    expect(actualResult, `${path} length`).eql(expectedResult);
  }
}
