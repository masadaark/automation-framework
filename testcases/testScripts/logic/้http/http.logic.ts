import { DataTable } from '@cucumber/cucumber';
import VFormatter from '../../class/formatter.class';
import ScenarioClass from '../../class/scenario.class';
import TcClass from '../../class/test_cases.class';
import { HttpFileModel } from '../../interface/file_interface/http_file.model';
import HttpProtocol from '../../protocol/http.protocol';
import FileU from '../../util/file.util';
import Obj from '../../util/object.util';
import Validator from '../validator.logic';
import StorageLogic from '../storage/storage.logic';
import { ApiFileModel } from '../../interface/file_interface/api_collection.model';
import ResClass from '../../class/response.class';
import { EnumFilePath } from '../../enum/file_path.enum';
import FileReaderLogic from '../file_reader.logic';

class HttpLogic {
  private static initApiPath(): string {
    let apiPath: string = TcClass.HttpFile?.apiPath as string;
    if (ScenarioClass.Http.paramReplace) {
      apiPath = VFormatter.PathReplace(apiPath, VFormatter.Exec(ScenarioClass.Http.paramReplace));
    }
    if (Validator.Var(ScenarioClass.Http.request?.query)) {
      apiPath = `${apiPath}?${HttpProtocol.ObjToQueries(VFormatter.Exec(ScenarioClass.Http.request.query))}`;
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
    await HttpProtocol.REQUEST(this.initApiPath(), TcClass.HttpFile.method, request?.headers, request?.body);
  }

  static async MultiRequestJsonFile(file: string): Promise<void> {
    const httpFile: HttpFileModel = await FileReaderLogic.JsonPayload(file);
    TcClass.HttpFile = httpFile;
    const filteredScenarios = httpFile.scenarios.filter((o) => o.tcNo.includes(TcClass.tcNo));
    ScenarioClass.MultiHttp = Obj.New(filteredScenarios);
    if (Validator.Var(ScenarioClass.MultiHttp)) {
      const requests = ScenarioClass.MultiHttp.map(async (http, requestId) => {
        ScenarioClass.Http = http;
        const rawReq = http.request;

        const resp = await HttpProtocol.REQUEST(this.initApiPath(), httpFile.method, rawReq?.headers, rawReq?.body);
        return {
          requestId,
          body: resp?.body,
          status: resp?.status,
        };
      });
      const responses = await Promise.all(requests);
      ResClass.MultiHttp = responses.sort((a, b) => a.requestId - b.requestId);
    }
  }

  static async TableHttp(api: string, method: string, dbbTable: DataTable): Promise<any> {
    if (!Validator.Var(dbbTable)) return await HttpProtocol.REQUEST(StorageLogic.RepStrVar(api), method);
    const reqObjs: Record<string, any>[] = Obj.ArrToObj(dbbTable['rawTable']).filter((o: Record<string, any>) =>
      String(o['tcNo']).split(',').includes(String(TcClass.tcNo))
    );
    if (!reqObjs.length) return;
    const promises = reqObjs.map(async (reqObj) => {
      delete reqObj['tcNo'];
      let requestBody: any = reqObj;
      if ('requestBody' in reqObj) {
        requestBody = reqObj['requestBody'];
      }
      return HttpProtocol.REQUEST(api, method, reqObj['headers'], VFormatter.Exec(requestBody));
    });
    return await Promise.all(promises);
  }
  static async ApiFolder(file: string): Promise<any> {
    const apiFile: ApiFileModel = VFormatter.Exec(await FileReaderLogic.ApiCollection(file));
    await HttpProtocol.REQUEST(apiFile.apiPath, apiFile.method, apiFile.headers, apiFile.body);
  }
}

export default HttpLogic;
