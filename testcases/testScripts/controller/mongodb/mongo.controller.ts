import { binding, given } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';

@binding()
export class MongoController {
  @given('{string} Insert MongoDB', { timeout: Cfg.stepTimeOut })
  public MongoDBInsert(): void {
   
  }

}
