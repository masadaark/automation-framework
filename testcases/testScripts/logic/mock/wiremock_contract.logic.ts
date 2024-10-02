import { HttpRequest } from "../../interface/file_interface/http_file.model";
import Obj from "../../util/object.util";

export default class WiremockContractLogic {
    private static CreateContractBody = (req: HttpRequest) => {
        if (!req.body || !Obj.CanParse(req)) return
        const formatBody = (v: any): any => {
            if (typeof v === 'object' && v !== null) {
                if (Array.isArray(v)) return v.map(formatBody);
                for (let k in v) v[k] = formatBody(v[k]);
            } else return this.ScanType(v);
            return v
        }
        const jsonBody = formatBody(Obj.Parse(req.body))
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
        }
        return "${json-unit.ignore}"
    }
}