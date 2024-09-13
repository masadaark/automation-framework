import { binding, when } from 'cucumber-tsflow';
import HttpLogic from '../logic/้http/http.logic';
import Cfg from '../class/config.class';
import HttpProtocol from '../protocol/http.protocol';
import { DataTable } from '@cucumber/cucumber';

@binding()
export class HttpController {
  @when('StepDef.{string} fileName.{string} Http Request', {
    timeout: Cfg.stepTimeOut,
  })
  public async HttpRequestByJsonFileWithComment(_des: string, file: string): Promise<void> {
    await HttpLogic.RequestJsonFile(file);
  }
  @when('{string} Http Request', { timeout: Cfg.stepTimeOut })
  public async HttpRequestByJsonFile(file: string): Promise<void> {
    await HttpLogic.RequestJsonFile(file);
  }
  @when('{string} Http GET', { timeout: Cfg.stepTimeOut })
  public async HttpGETRequest(api: string): Promise<void> {
    await HttpProtocol.REQUEST(api, "GET");
  }
  @when(`Http POST {string}`, { timeout: Cfg.stepTimeOut })
  public async HttpPostRequest(api: string, bddTable: DataTable): Promise<void> {
    await HttpLogic.TableHttp(api, "POST", bddTable);
  }
  @when(`Http {string} {string}`, { timeout: Cfg.stepTimeOut })
  public async HttpMethodRequest(method: string, api: string, bddTable: DataTable): Promise<void> {
    await HttpLogic.TableHttp(api, method, bddTable);
  }
}
