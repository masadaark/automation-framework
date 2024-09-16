import { binding, given } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import CollectorLogic from '../../logic/collector.logic';
import { ContentTypeEnum } from '../../enum/content.enum';

@binding()
export class StorageCollectorController {
  @given('Collect Response parameter data fileName.{string}', { timeout: Cfg.stepTimeOut })
  @given('Collect Response param.{string}', { timeout: Cfg.stepTimeOut })
  public async CollectResponseJsonFile(file: string): Promise<void> {
    CollectorLogic.JsonFile(file, ContentTypeEnum.http);
  }
  @given('Collect Query parameter data fileName.{string}', { timeout: Cfg.stepTimeOut })
  @given('Collect Query param.{string}', { timeout: Cfg.stepTimeOut })
  public async CollectQueryResultJsonFile(file: string): Promise<void> {
    CollectorLogic.JsonFile(file, ContentTypeEnum.postgresql);
  }
}
