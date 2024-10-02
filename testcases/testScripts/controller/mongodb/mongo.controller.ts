import { binding, given } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import PgAssertionLogic from '../../logic/sql/pg_assertion.logic';
import ResClass from '../../class/response.class';
import ScenarioClass from '../../class/scenario.class';


@binding()
export class MongoController {
  @given('{string} Insert MongoDB', { timeout: Cfg.stepTimeOut })
  public MongoDBInsert(): void {
    if (!ScenarioClass.PgDB?.expect) return;
    PgAssertionLogic.Version1(ResClass.Query, ScenarioClass.PgDB?.expect);
  }

}
