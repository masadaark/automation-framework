import { binding, when } from 'cucumber-tsflow';
import HttpLogic from '../logic/้http/http.logic';
import Cfg from '../class/config.class';
import HttpProtocol from '../protocol/http.protocol';

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
  public async HttpGET(api: string): Promise<void> {
    await HttpProtocol.REQUEST(api, "GET");
  }
}
