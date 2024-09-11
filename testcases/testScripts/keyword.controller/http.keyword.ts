import { expect } from "chai";
import { binding, given, when } from "cucumber-tsflow";

@binding()
export class HttpKeyword {
    @when("StepDef.{string} fileName.{string} Http Request")
    public HttpRequestByJsonFileWithComment(_des: string, file: string): void {

        expect(1, "test").to.equal(1);
    }
    @when("{string} Http Request")
    public HttpRequestByJsonFile(file: string): void {

        expect(1, "test").to.equal(1);
    }

}