import VFormatter from '../../class/formatter.class';
import AssertionLogic from '../assertion.logic';
import IndianReportLogic from '../report.logic';

export default class PgAssertionLogic {
  static Version1(act: Record<string, any>[], exp: Record<string, any>[]): void {
    for (const obj of exp) {
      const columnName = obj['column'];
      for (let i = 0; i < act.length; i++) {
        const actualResult = act[i][columnName];
        const expectedResult = VFormatter.Exec(obj['value'][i]);
        const path = `${columnName}[${i}]`;
        IndianReportLogic.AddTestStep({ actualResult, expectedResult, path });
        AssertionLogic.Equal(actualResult, expectedResult, path);
      }
    }
  }
}
