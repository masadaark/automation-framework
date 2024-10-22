import { DataTable } from '@cucumber/cucumber';
import VFormatter from '../../class/formatter.class';
import ScenarioClass from '../../class/scenario.class';
import TcClass from '../../class/test_cases.class';
import { HttpFileModel } from '../../interface/file_interface/http_file.model';
import ProtocolHttp from '../../protocol/http.protocol';
import Obj from '../../util/object.util';
import Validator from '../validator.logic';
import StorageLogic from '../storage/storage.logic';
import { ApiFileModel } from '../../interface/file_interface/api_collection.model';
import ResClass from '../../class/response.class';
import FileReaderLogic from '../file_reader.logic';

class HttpLogic {
  private static initApiPath(): string {
    let apiPath: string = TcClass.HttpFile?.apiPath as string;
    if (ScenarioClass.Http.paramReplace) {
      apiPath = VFormatter.PathReplace(apiPath, VFormatter.Exec(ScenarioClass.Http.paramReplace));
    }
    if (Validator.Var(ScenarioClass.Http.request?.query)) {
      apiPath = `${apiPath}?${ProtocolHttp.ObjToQueries(VFormatter.Exec(ScenarioClass.Http.request.query))}`;
    }
    return apiPath;
  }
  static async RequestJsonFile(file: string): Promise<void> {
    const httpFile: HttpFileModel = await FileReaderLogic.JsonPayload(file);
    TcClass.HttpFile = httpFile;
    ScenarioClass.Http = ScenarioClass.NewHttp();
    ScenarioClass.Http = Obj.New(Obj.FindInclude(httpFile.scenarios, 'tcNo', TcClass.tcNo));
    if (!Validator.Var(ScenarioClass.Http)) return;
    const request = ScenarioClass.Http.request;
    await ProtocolHttp.REQUEST(this.initApiPath(), TcClass.HttpFile.method, request?.headers, request?.body);
  }

  static async MultiRequestJsonFile(file: string): Promise<void> {
    const httpFile: HttpFileModel = await FileReaderLogic.JsonPayload(file);
    TcClass.HttpFile = httpFile;
    const filteredScenarios = httpFile.scenarios.filter((o) => o.tcNo.includes(TcClass.tcNo));
    ScenarioClass.MultiHttp = Obj.New(filteredScenarios);
    if (Validator.Var(ScenarioClass.MultiHttp)) {
      const responses: any[] = [];
      for (const http of ScenarioClass.MultiHttp) {
        ScenarioClass.Http = http;
        const rawReq = http.request;
        const resp = await ProtocolHttp.REQUEST(this.initApiPath(), httpFile.method, rawReq?.headers, rawReq?.body);
        responses.push({
          body: resp.response.body,
          status: resp.response.status,
        });
      }
      ResClass.MultiHttp = responses;
    }
  }

  static async TableHttp(api: string, method: string, dbbTable: DataTable): Promise<any> {
    if (!Validator.Var(dbbTable)) return await ProtocolHttp.REQUEST(StorageLogic.RepStrVar(api), method);
    const reqObjs: Record<string, any>[] = Obj.ArrToObj(dbbTable['rawTable']).filter((o: Record<string, any>) =>
      String(o['tcNo']).split(',').includes(String(TcClass.tcNo))
    );
    if (!reqObjs.length) return;
    for (const reqObj of reqObjs) {
      delete reqObj['tcNo'];
      let requestBody: any = reqObj;
      if ('requestBody' in reqObj) {
        requestBody = reqObj['requestBody'];
      }
      await ProtocolHttp.REQUEST(api, method, reqObj['headers'], VFormatter.Exec(requestBody));
    }
  }
  static async ApiFolder(file: string): Promise<any> {
    const apiFile: ApiFileModel = VFormatter.Exec(await FileReaderLogic.ApiCollection(file));
    await ProtocolHttp.REQUEST(apiFile.apiPath, apiFile.method, apiFile.headers, apiFile.body);
  }
}

export default HttpLogic;
