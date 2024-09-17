import { binding, given } from "cucumber-tsflow";
import Cfg from "../../class/config.class";

@binding()
export class StorageCollectorController {
    @given('Set Var {string}:{string}', { timeout: Cfg.stepTimeOut })
    public CollectResponseJsonFile(file: string): void {
        
    }
}
