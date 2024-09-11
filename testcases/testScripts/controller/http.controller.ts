import { binding, when } from 'cucumber-tsflow';
import HttpLogic from '../logic/้http/http.logic';
import Cfg from '../class/config.class';

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
}
