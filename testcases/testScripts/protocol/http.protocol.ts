import _ from 'lodash';
import Cfg from '../class/config.class';
import VFormatter from '../class/formatter.class';
import ResClass from '../class/response.class';
import IndianReportLogic from '../logic/report.logic';
import StorageLogic from '../logic/storage/storage.logic';
import Validator from '../logic/validator.logic';
import Obj from '../util/object.util';
import Str from '../util/string.util';

class HttpProtocol {
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
  ): Promise<{ request: any, response: any }> {
    const url = this.InitUrl(apiPath)
    console.warn(`${method} : ${url}`);
    const defaultHeader: {} = !Obj.IsObj(Validator.Var(Cfg.appSetting.headers)) ? Cfg.appSetting.headers : {}
    headers = VFormatter.Exec(Obj.Merge(headers, defaultHeader));
    headers['content-type'] = headers['content-type'] ?? 'application/json';
    headers['userId'] = headers['userId'] ?? 1
    body = VFormatter.Exec(body) ?? {};
    const fetchOption = { method, headers, body: Obj.ToString(body) };
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
    let url: string = apiPath
    if (apiPath.startsWith('/') || apiPath.startsWith('api')) {
      const normalizedPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
      url = `${Cfg.appSetting.baseUrl.replace(/\/$/, '')}${normalizedPath}`
    };
    return StorageLogic.RepStrVar(url)
  }
}

export default HttpProtocol;
