import { HttpRequest, HttpResponse } from "./http_file.model";

export interface ConsumerContractFile {
  contractName: string;
  consumerService: string;
  providerService: string;
  jsonPayload: JsonPayload
}

export interface JsonPayload {
  apiPath: string;
  method: string;
  request: HttpRequest;
  response: HttpResponse;
}