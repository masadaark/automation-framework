import { JsonPayload } from "../../interface/file_interface/consumer_contract.model";
import { HttpRequest } from "../../interface/file_interface/http_file.model";
import Obj from "../../util/object.util";

export default class WiremockContractLogic {
    private static CreateContractBody = (req: HttpRequest) => {
        if (!req.body || (!Obj.CanParse(req.body) && typeof req.body !== 'object')) req.body
        const formatBody = (v: any): any => {
            if (typeof v === 'object' && v !== null) {
                if (Array.isArray(v)) return v.map(formatBody);
                for (let k in v) v[k] = formatBody(v[k]);
                return v
            } else return this.ScanType(v);
        }
        return formatBody(Obj.Parse(req.body))
    }

    private static ScanType(v: string): string {
        const vType = typeof v
        switch (vType) {
            case 'string':
                return "${json-unit.any-string}"
            case 'boolean':
                return "${json-unit.any-boolean}"
            case 'number':
                return "${json-unit.any-number}"
            default:
                return "${json-unit.ignore}"
        }
    }

    public static POST(jsonPayload: JsonPayload) {
        const requestBody = this.CreateContractBody(jsonPayload.request)
        console.log("CONTRACT", requestBody)
    }
}