import { binding, when } from 'cucumber-tsflow';
import ScenarioClass from '../class/scenario.class';
import HttpAssertionLogic from '../logic/้http/http_assertion.logic';
import ResClass from '../class/response.class';
import { HttpListResponse, HttpResponse } from '../interface/file_interface/http_file.model';

@binding()
export class HttpAssertionController {
  @when('Expecting Http response subset')
  public HttpResponseAssertionSubset(): void {
    if (!ScenarioClass.Http) return;
    HttpAssertionLogic.SubSet(ResClass.Http, ScenarioClass.Http.response as HttpResponse);
  }
  @when('Expecting Http response deeply equal')
  public HttpResponseAssertionDeeplyEqual(): void {
    if (!ScenarioClass.Http) return;
    HttpAssertionLogic.DeepEqual(ResClass.Http, ScenarioClass.Http.response as HttpResponse);
  }
  @when('Expecting Http response list')
  public HttpResponseAssertionList(): void {
    if (!ScenarioClass.Http) return;
    HttpAssertionLogic.List(ResClass.Http, ScenarioClass.Http.response as HttpListResponse);
  }
  @when('Expect Http response model')
  public HttpResponseAssertionModel(): void {
    if (!ScenarioClass.Http) return;
    HttpAssertionLogic.Model(ResClass.Http, ScenarioClass.Http.response as HttpResponse);
  }
}
