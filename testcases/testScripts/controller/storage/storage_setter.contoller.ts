import { binding, given } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import SetVarLogic from '../../logic/storage/set_variable.logic';
import StorageClass from '../../class/storage.class';
import VFormatter from '../../class/formatter.class';

@binding()
export class StorageCollectorController {
  @given('Set variable {string}', { timeout: Cfg.stepTimeOut })
  public async SetVarFromJsonFile(file: string): Promise<void> {
    await SetVarLogic.JsonFile(file);
  }
  @given('Set Var {string}:{string}', { timeout: Cfg.stepTimeOut })
  public async SetVarFeature(key: string, val: string): Promise<void> {
    await SetVarLogic.DataSetter(key, val);
  }
  @given('Set Num Var {string}:{string}', { timeout: Cfg.stepTimeOut })
  public SetNumberVarFeature(key: string, val: string): void {
    StorageClass.add(key, Number(VFormatter.Exec(val)));
  }
  @given('Clear Param Storage', { timeout: Cfg.stepTimeOut })
  public ClearParamStorage(): void {
    StorageClass.reset();
  }
}
