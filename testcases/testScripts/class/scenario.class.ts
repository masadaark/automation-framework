import { ScenarioDB } from '../interface/file_interface/db_file.model';
import { ScenarioHttp } from '../interface/file_interface/http_file.model';
import Validator from '../logic/validator.logic';
import Formatter from './formatter.class';

class ScenarioClass {
  private static _DB: ScenarioDB;

  private static _Http: ScenarioHttp;

  private static _MultiHttp: ScenarioHttp[];

  // private static _Rabbit: ScenarioRabbit

  static reset(): void {
    this._DB = this.NewDB();
    this._Http = this.NewHttp();
    this._MultiHttp = [];
    // this._Rabbit = this.NewRabbit()
  }

  static set Http(val: ScenarioHttp) {
    if (Validator.Var(val) && 'response' in val && 'body' in val.response)
      val.response.body = Formatter.Exec(val.response.body);
    this._Http = val;
  }

  static get Http() {
    return this._Http;
  }

  static set DB(val: ScenarioDB) {
    this._DB = val;
  }

  static get DB() {
    return this._DB;
  }

  static set MultiHttp(val: ScenarioHttp[]) {
    this._MultiHttp = val;
  }

  static get MultiHttp() {
    return this._MultiHttp;
  }

  // static set Rabbit(val: ScenarioRabbit) {
  //     this._Rabbit = val
  // }

  // static get Rabbit() {
  //     return this._Rabbit
  // }

  static NewHttp() {
    return { request: {}, response: { body: {} }, tcNo: [] };
  }

  static NewDB() {
    return { tcNo: [] };
  }

  static NewRabbit() {
    return { tcNo: [], message: {} };
  }
}
export default ScenarioClass;
