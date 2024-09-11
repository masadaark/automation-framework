import { expect } from "chai"
import IndianReportLogic from "../report.logic"
import Formatter from "../../class/formatter.class"
import AssertionLogic from "../assertion.logic"

class HttpAssertionLogic {

    static SubSet(actualRes: Record<string, any>, expectRes: Record<string, any>): void {
        if (!expectRes) return
        const expectedBody = Formatter.Exec(expectRes["body"])
        IndianReportLogic.AddTestStep({
            actualResult: {
                status: actualRes["status"],
                body: actualRes["body"]
            }, expectedResult: {
                status: expectRes["status"],
                body: expectedBody
            }
        })
        if ("status" in expectRes) expect(actualRes["status"]).equal(expectRes["status"])
        if ("body" in expectRes) AssertionLogic.SubSet(actualRes["body"], expectedBody, "")
    }
}

export default HttpAssertionLogic