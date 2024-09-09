import { expect } from "chai";
import { binding, given } from "cucumber-tsflow";

@binding()
export class TestSteps {
    @given("TEST LOG")
    public testLog2(): void {
      expect(1, "test").to.equal(2);
    }
  }