export interface WiremockFile {
  apiPath: string;
  method: string;
  scenarios: ScenarioWiremock[];
}

export interface ScenarioWiremock {
  paramReplace?: Record<string, string | number>;
  paramType?: string;
  tcNo: number[];
  headers?: any;
  request: any;
  response: WiremockResponse;
}

export interface WiremockResponse {
  status?: number;
  body?: any;
  headers: {};
  equalToFile?: string;
}
