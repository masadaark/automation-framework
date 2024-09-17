import { binding, then } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import VFormatter from '../../class/formatter.class';
import { expect } from 'chai';
import AssertionLogic from '../../logic/assertion.logic';

@binding()
export class StorageAssertionController {
  @then('Vars {string} should Contains {string}', { timeout: Cfg.stepTimeOut })
  public VarsShouldContainsAssertion(varKeys: string, values: string): void {
    const varKeyArr = varKeys.split(',');
    const expectValueArr = VFormatter.Exec(values.split(','));
    for (const i in varKeyArr) {
      expect(VFormatter.Exec(varKeyArr[i]), varKeyArr[i]).contains(expectValueArr[i]);
    }
  }
  @then('Vars {string} should Equal {string}', { timeout: Cfg.stepTimeOut })
  public VarsShouldEqualAssertion(varKeys: string, values: string): void {
    const varKeyArr = varKeys.split(',');
    const expectValueArr = VFormatter.Exec(values.split(','));
    for (const i in varKeyArr) {
      AssertionLogic.Equal(VFormatter.Exec(varKeyArr[i]), expectValueArr[i], varKeyArr[i]);
    }
  }
  @then('Array Var:{string} Includes Object Var:{string}', { timeout: Cfg.stepTimeOut })
  public VarsArrIncludesObjectAssertion(actualVar: string, expectedVar: string): void {
    const actualArr = VFormatter.Exec(actualVar);
    const expectobj = VFormatter.Exec(expectedVar);
    const actualObj = actualArr.find((o: any) => {
      const flag = true;
      for (const key in expectobj) {
        if (typeof expectobj[key] === 'object') continue;
        if (expectobj[key] !== o[key]) return false;
      }
      return flag;
    });
    // if (!actualObj) console.warn('**No Matching Object Found**');
    AssertionLogic.SubSet(actualObj, expectobj, '');
  }
}
