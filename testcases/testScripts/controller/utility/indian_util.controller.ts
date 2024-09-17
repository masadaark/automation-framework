import { binding, given } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import VFormatter from '../../class/formatter.class';
import { execSync } from 'child_process';
import IndianReportLogic from '../../logic/report.logic';
import ResClass from '../../class/response.class';
import StorageClass from '../../class/storage.class';
import _ from 'lodash';
import HttpProtocol from '../../protocol/http.protocol';

@binding()
export class UtilityController {
  @given('Wait {int} second', { timeout: Cfg.stepTimeOut })
  public async Delay(sec: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }
  @given('Exec {string}', { timeout: Cfg.stepTimeOut })
  public ExecSync(cmdLine: string): void {
    let cmd: string = VFormatter.Exec(cmdLine);
    let cmdResult: any;
    try {
      cmdResult = execSync(cmd, { encoding: 'utf-8' });
    } catch {
      try {
        cmd = `wsl -e ${cmd}`;
        cmdResult = execSync(cmd, { encoding: 'utf-8' });
      } catch (wslError) {
        throw new Error(`${wslError}`);
      }
    } finally {
      IndianReportLogic.AddTestStep({ cmd, cmdResult });
      ResClass.Http = { body: cmdResult };
    }
  }
  @given('Map Array Var {string} key {string} as {string}', { timeout: Cfg.stepTimeOut })
  public MapArrayVarKeytoArray(varName: string, validKey: string, arrayName: string): void {
    const varValue = StorageClass.get(varName);
    const newArr: any[] = [];
    function scan(value: any): void {
      if (typeof value === 'object' && value !== null) {
        for (const key in value) {
          if (key === validKey) {
            newArr.push(value[key]);
          }
          scan(value[key]);
        }
      }
    }
    scan(varValue);
    StorageClass.add(arrayName, newArr);
  }
  @given('Unique Array Var {string}', { timeout: Cfg.stepTimeOut })
  public UniqueArrayVar(varName: string): void {
    const array = StorageClass.get(varName);
    const uniqueArray =
      Array.isArray(array) && array.length > 0
        ? typeof array[0] === 'object'
          ? _.uniqWith(array, _.isEqual)
          : _.uniq(array)
        : array;
    StorageClass.add(varName, uniqueArray);
  }
  @given('Map Array Var {string} To Query Param Key {string} as {string}', { timeout: Cfg.stepTimeOut })
  public VarArrToQueryParam(arrVarName: string, queryKey: string, varName: string): void {
    const array = StorageClass.get(arrVarName)
      .map((v: string) => `${queryKey}=${v}`)
      .join('&');
    StorageClass.add(varName, array);
  }
  @given('Map Object Var {string} To Query Param as {string}', { timeout: Cfg.stepTimeOut })
  public VarToQueryParam(objectVarName: string, varName: string): void {
    StorageClass.add(varName, HttpProtocol.ObjToQueries(StorageClass.get(objectVarName)));
  }
}
