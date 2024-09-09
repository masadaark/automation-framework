import { expect } from "chai";
import { binding, given } from "cucumber-tsflow";
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
  @given("TEST PASS")
  public testLog(): void {
    count += 1
    IndianReportLogic.AddTestStep(count)
    expect(1, "test").to.equal(1);
  }
}