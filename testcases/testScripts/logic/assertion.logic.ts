import { expect } from 'chai';
import TypeLogic from './type.logic';
import DateU from '../util/date.util';
import StorageLogic from './storage/storage.logic';
import VFormatter from '../class/formatter.class';
import Obj from '../util/object.util';
import IndianReportLogic from './report.logic';

class AssertionLogic {
  static SubSet(acc: any, exp: any, path: string) {
    if (typeof exp === 'object' && exp !== null) {
      for (const key in exp) {
        this.SubSet(acc[key], exp[key], `${path}.${key}`);
      }
    } else this.Equal(acc, exp, path);
  }
  static Equal(act: any, exp: any, path: string): void {
    switch (TypeLogic.Type(exp)) {
      case 'number':
        expect(Number(act), path).eq(Number(exp));
        break;
      case 'date':
        expect(DateU.ToDate(act), path).eq(exp);
        break;
      case 'dateTime':
        expect(DateU.ToDateTime(act), path).eq(DateU.ToDateTime(exp));
        break;
      case 'null':
        expect(act, path).to.be.oneOf([undefined, null]);
        break;
      case 'string':
      default:
        act = String(act);
        exp = String(exp);
        if (exp.endsWith('.trim()')) {
          act = act.trim().replace(/\s+/g, '');
          exp = exp.trim().replace(/\s+/g, '').replace('.trim()', '');
        }
        expect(act, path).eq(exp);
    }
  }
  static Path(actualRes: {}, path: string, expVal: string): void {
    const actualResult: any = StorageLogic.ObjPathVal(actualRes, path);
    const expectedResult = VFormatter.Exec(Obj.Parse(expVal));
    IndianReportLogic.AddTestStep({ actualResult, expectedResult, path });
    AssertionLogic.SubSet(actualResult, expectedResult, '');
  }
  static PathContins(actualRes: {}, path: string, expVal: string): void {
    const actualResult: any = StorageLogic.ObjPathVal(actualRes, path);
    const expectedResult = VFormatter.Exec(Obj.Parse(expVal));
    IndianReportLogic.AddTestStep({ actualResult, expectedResult, path });
    expect(actualResult, `response:${path}`).to.include(expectedResult);
  }
  static PathNotContins(actualRes: {}, path: string, expVal: string): void {
    const actualResult: any = StorageLogic.ObjPathVal(actualRes, path);
    const expectedResult = VFormatter.Exec(Obj.Parse(expVal));
    IndianReportLogic.AddTestStep({ actualResult, expectedResult, path });
    expect(actualResult, `response:${path}`).to.not.include(expectedResult);
  }
}

export default AssertionLogic;
