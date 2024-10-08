import _ from 'lodash';
import VFormatter from '../class/formatter.class';
import ResClass from '../class/response.class';
import IndianReportLogic from '../logic/report.logic';
import StorageLogic from '../logic/storage/storage.logic';
import Validator from '../logic/validator.logic';
import Obj from '../util/object.util';
import Str from '../util/string.util';
import { AppSettingModel } from '../interface/app_setting.model';

class ProtocolHttp {
  private static _url: string;
  private static _defaultHeaders: Record<string, any>;

  static Init(cfg: AppSettingModel) {
    this._url = cfg?.baseUrl?.endsWith('/') ? cfg?.baseUrl.slice(0, -1) : cfg?.baseUrl;
    this._defaultHeaders = !Obj.IsObj(Validator.Var(cfg?.headers)) ? cfg?.headers : {};
    this._defaultHeaders['userId'] = this._defaultHeaders['userId'] ?? 1;
  }

  static ObjToQueries(obj: any): string {
    return Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join('&');
  }

  static async REQUEST(
    apiPath: string,
    method: string,
    headers: Record<string, any> = {},
    body?: any
  ): Promise<{ request: any; response: any }> {
    const url = this.InitUrl(apiPath);
    console.warn(`${method} : ${url}`);
    headers = VFormatter.Exec(Obj.Merge(headers, this._defaultHeaders));
    headers['content-type'] = headers['content-type'] ?? 'application/json';

    const fetchOption: any = { method, headers };
    if (method !== 'GET' && method !== 'HEAD') {
      body = VFormatter.Exec(body) ?? {};
      fetchOption.body = Obj.ToString(body);
    }
    let response;
    try {
      response = await fetch(url, fetchOption);
    } catch (error) {
      console.error('http request errors:', error);
      IndianReportLogic.AddTestStep(error);
      return {
        request: {
          url,
          ...fetchOption,
          body: Obj.Parse(body),
        },
        response: { body: {}, status: 999 },
      };
    } finally {
      let responseBody = Obj.Parse(await response?.text());
      if (typeof responseBody === 'string') responseBody = Str.RemoveFirstLastChar(responseBody);
      ResClass.Http = { body: responseBody, status: response?.status };
      IndianReportLogic.AddTestStep({
        request: {
          url,
          ...fetchOption,
          body: Obj.Parse(body),
        },
        response: ResClass.Http,
      });
      return {
        request: {
          url,
          ...fetchOption,
          body: Obj.Parse(body),
        },
        response: ResClass.Http,
      };
    }
  }

  private static InitUrl(apiPath: string) {
    let url: string = apiPath;
    if (apiPath.startsWith('/') || apiPath.startsWith('api')) {
      const normalizedPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
      url = `${this._url.replace(/\/$/, '')}${normalizedPath}`;
    }
    return StorageLogic.RepStrVar(url);
  }
}

export default ProtocolHttp;
