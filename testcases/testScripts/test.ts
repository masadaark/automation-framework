import { expect } from "chai";
import { before, binding, given } from "cucumber-tsflow";
import { writeFile } from "fs";


@binding()
export class TestSteps {
  @before()
  public cucumberHook(test: any): void {
    writeFile("hook", JSON.stringify(test, null, 2), function (err) {
      if (err) return console.error(`เขียนทับ hook ไม่สำเร็จ err:`, err);
    });
  }
  @given("TEST STEP")
  public testLog2(): void {
    expect(1, "test").to.equal(2);
  }
}