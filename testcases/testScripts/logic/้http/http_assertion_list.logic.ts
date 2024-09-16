import { expect } from 'chai';
import { ListExpect } from '../../interface/file_interface/http_file.model';
import Validator from '../validator.logic';
import Obj from '../../util/object.util';
import StorageLogic from '../storage.logic';
import { Comparator, LogicOperator } from '../../enum/type.enum';
import Formatter from '../../class/formatter.class';
import CompLogic from '../comparator.logic';

const AssertHttpList = {
  Index(actArr: any[], expArr: ListExpect[], operator: string = 'and'): void {
    Validator.LogicOperator(operator);
    for (const [i, childObj] of Obj.New(actArr).entries()) {
      const isPasses: boolean[] = [];
      for (const exp of expArr) {
        const acts = exp.key
          ? [StorageLogic.ObjPathVal(childObj, exp.key)]
          : Obj.DeepKeyVal(childObj, exp.deeplyKey ?? '');
        const expectedResult = Formatter.Exec(exp.value);
        const comp: Comparator = exp.comparator ?? 'equal';
        for (const act of acts) {
          isPasses.push(CompLogic.Flag(act, expectedResult, comp));
          AssertHttpList.Assert(act, expectedResult, comp, i, operator as LogicOperator);
        }
      }
      if (operator === 'or' && isPasses.every((element) => element === false)) {
        throw new Error(`index : ${[i]} ไม่ตรงเงื่อนไข`);
      }
    }
    expect(true, 'List ตรงเงื่อนไข').to.be.true;
  },
  Assert(act: any, exp: any, comp: Comparator, i: number, oper: LogicOperator): void {
    if ((oper === 'not' && CompLogic.Flag(act, exp, comp)) || (oper === 'and' && !CompLogic.Flag(act, exp, comp))) {
      throw new Error(`logic : ${oper} index : ${[i]} actual : ${act} ,${comp} expect :${exp}`);
    }
  },
};

export default AssertHttpList;
