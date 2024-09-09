import { expect } from "chai";
import { before, binding, given } from "cucumber-tsflow";
import { writeFile } from "fs";
import IndianReportLogic from "./logic/report.logic";

let count = 1

@binding()
export class TestSteps {
  @given("TEST STEP")
  public testLog2(): void {
    count += 1
    IndianReportLogic.AddTestStep(count)
    expect(1, "test").to.equal(2);
  }
}