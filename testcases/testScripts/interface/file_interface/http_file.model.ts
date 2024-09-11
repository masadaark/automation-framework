import { Comparator, LogicOperator } from '../../enum/type.enum';

export interface HttpFile {
  apiPath: string;
  method: string;
  scenarios: ScenarioHttp[];
}

export interface ScenarioHttp {
  paramReplace?: Record<string, string | number>;
  tcNo: number[];
  request: HttpRequest;
  response: HttpResponse;
}

export interface HttpRequest {
  headers?: {};
  body?: any;
  query?: Record<string, any>;
}

export interface HttpResponse {
  status?: number;
  body: any;
}

export interface HttpListResponse {
  responsePath?: string;
  expectList: ListExpect[];
  length?: number | string;
  logicOperator?: LogicOperator;
}

export interface ListExpect {
  comparator?: Comparator;
  key?: string;
  deeplyKey?: string;
  value: string | number;
}
