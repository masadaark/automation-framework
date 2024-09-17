import { ScenarioDB } from '../interface/file_interface/db_file.model';
import { ScenarioHttp } from '../interface/file_interface/http_file.model';
import Validator from '../logic/validator.logic';
import VFormatter from './formatter.class';

class ScenarioClass {
  private static _PgDB: ScenarioDB;

  private static _Http: ScenarioHttp;

  private static _MultiHttp: ScenarioHttp[];

  // private static _Rabbit: ScenarioRabbit

  static reset(): void {
    this._PgDB = this.NewPgDB();
    this._Http = this.NewHttp();
    this._MultiHttp = [];
    // this._Rabbit = this.NewRabbit()
  }

  static set Http(val: ScenarioHttp) {
    if (Validator.Var(val) && 'response' in val && 'body' in val.response)
      val.response.body = VFormatter.Exec(val.response.body);
    this._Http = val;
  }

  static get Http() {
    return this._Http;
  }

  static set PgDB(val: ScenarioDB) {
    this._PgDB = val;
  }

  static get PgDB() {
    return this._PgDB;
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

  static NewPgDB() {
    return { tcNo: [] };
  }

  static NewRabbit() {
    return { tcNo: [], message: {} };
  }
}
export default ScenarioClass;
