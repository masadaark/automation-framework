import { binding, given, when } from 'cucumber-tsflow';
import HttpLogic from '../../logic/้http/http.logic';
import Cfg from '../../class/config.class';
import ProtocolHttp from '../../protocol/http.protocol';
import { DataTable } from '@cucumber/cucumber';
import StorageLogic from '../../logic/storage/storage.logic';
import ResClass from '../../class/response.class';
import _ from 'lodash';

@binding()
export class HttpController {
  @when('StepDef.{string} fileName.{string} Http Request', {
    timeout: Cfg.stepTimeOut,
  })
  public async HttpRequestByJsonFileWithComment(_des: string, file: string): Promise<void> {
    await this.HttpRequestByJsonFile(file);
  }
  @when('{string} Http Request', { timeout: Cfg.stepTimeOut })
  public async HttpRequestByJsonFile(file: string): Promise<void> {
    await HttpLogic.RequestJsonFile(file);
  }
  @given(`StepDef.{string} fileName.{string} Multiple Http Request`, { timeout: Cfg.stepTimeOut })
  public async HttpMultipleRequestByJsonFileWithComment(_des: string, file: string): Promise<void> {
    await this.HttpMultipleRequestByJsonFile(file);
  }
  @given(`{string} Multiple Http Request`, { timeout: Cfg.stepTimeOut })
  public async HttpMultipleRequestByJsonFile(file: string): Promise<void> {
    await HttpLogic.MultiRequestJsonFile(file);
  }
  @when('{string} Http GET', { timeout: Cfg.stepTimeOut })
  public async HttpGETRequest(api: string): Promise<void> {
    await ProtocolHttp.REQUEST(api, 'GET');
  }
  @when(`Http POST {string}`, { timeout: Cfg.stepTimeOut })
  public async HttpPostRequest(api: string, bddTable: DataTable): Promise<void> {
    await HttpLogic.TableHttp(api, 'POST', bddTable);
  }
  @when(`Http {string} {string}`, { timeout: Cfg.stepTimeOut })
  public async HttpMethodRequest(method: string, api: string, bddTable: DataTable): Promise<void> {
    await HttpLogic.TableHttp(api, method, bddTable);
  }
  @given(`Http Request api:{string}`, { timeout: Cfg.stepTimeOut })
  public async HttpCollectionRequest(file: string): Promise<void> {
    await HttpLogic.ApiFolder(file);
  }
  @given(`Sort Http Response Path {string} By {string} {string}`, { timeout: Cfg.stepTimeOut })
  public async SortHttpResponseArray(path: string, sortBys: string, sortTypes: string): Promise<void> {
    const array = StorageLogic.ObjPathVal(ResClass.Http.body, path);
    if (!Array.isArray(array)) return;
    const sortingType = sortTypes.split(",").filter(t => ["asc", "desc"].includes(t))
    const newData = _.orderBy(array, sortBys.split(","), sortingType as ("asc" | "desc")[]);
    const paths = StorageLogic.PathToArr(path);
    let pointer = ResClass.Http.body;
    for (let i = 0; i < paths.length - 1; i++) {
      if (!pointer[paths[i]]) return;
      pointer = pointer[paths[i]];
    }
    const lastKey = paths[paths.length - 1]
    if (!lastKey) ResClass.Http.body = newData
    else pointer[lastKey] = newData
  }
}
