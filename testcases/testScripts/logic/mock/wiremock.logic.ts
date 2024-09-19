import Cfg from "../../class/config.class"
import VFormatter from "../../class/formatter.class"
import { WiremockResponse } from "../../interface/file_interface/wiremock.model"
import HttpProtocol from "../../protocol/http.protocol"
import Obj from "../../util/object.util"
import FileReaderLogic from "../file_reader.logic"
import Validator from "../validator.logic"

export default class WiremockLogic {
    private static _mappingsDefaultHeader: Record<string, any> = {
        "access-control-allow-headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "access-control-allow-origin": "*",
        'content-type': "application/json"
    }
    private static _flagClear: boolean = true
    private static _uuids: string[] = []
    private static _wiremockURL = ""

    public static InitWiremockUrl() {
        this._wiremockURL = Cfg.appSetting.wiremockUrl.endsWith("/") ? `${Cfg.appSetting.wiremockUrl}__admin/mappings/`
            : `${Cfg.appSetting.wiremockUrl}/__admin/mappings/`
    }
    static async POST(i: {
        method: string
        apiPath: string
        request: any
        response: WiremockResponse
        paramType: string
        headers: Record<string, any>
    }) {
        const headers = this.createHeaders(i.headers)
        const request = await this.createRequestResponse(i.request)
        const response = await this.createRequestResponse(i.response)
        const status = response.status ?? 200
        const respHeader = response.headers
        let requestWiremock: Record<string, any> = {
            request: this.BuildRequest(i.method, i.apiPath, i.paramType, request, headers),
            response: {
                jsonBody: response.body ?? response,
                transformers: ["response-template"],
                headers,
                status,
            }
        }
        if (headers['content-type'] !== this._mappingsDefaultHeader['content-type']) {
            requestWiremock = {
                request: this.BuildRequest(i.method, i.apiPath, "", request, headers),
                response: {
                    body: response.body ?? response,
                    transformers: ["response-template"],
                    headers: respHeader,
                    status: status
                }
            }
        }
        const httpResponse = await HttpProtocol.REQUEST(this._wiremockURL, "POST", {}, requestWiremock);
        this._uuids.push(httpResponse.response.body.uuid);
    }
    private static createHeaders(headers: Record<string, any>) {
        if (Validator.Var(headers) && (typeof headers === "object" || Obj.CanParse(headers))) {
            const r = Obj.Parse(headers)
            for (const k in this._mappingsDefaultHeader) {
                if (!(k in r)) r[k] = this._mappingsDefaultHeader[k]
            }
            return r
        } else return this._mappingsDefaultHeader
    }
    private static async createRequestResponse(v: any) {
        if ('equalToFile' in v) {
            const r = FileReaderLogic.ReadText(v["equalToFile"])
            if (typeof r === 'string' && String(r).startsWith("<")) return VFormatter.Exec(r)
            else VFormatter.Exec(Obj.Parse(v))
        }
        else return VFormatter.Exec(Obj.Parse(v))
    }

    private static BuildRequest(method: string
        , api: string, paramType: string, req: {}, headers: Record<string, string> = {}): {} {
        const reqObj: Record<string, any> = { method: method.toUpperCase() }
        if (/query/i.test(paramType) || (/get/i.test(method) && (Validator.Var(req)))) {
            reqObj.urlPath = api
            reqObj.queryParameters = this.QueryPattern(req);
        } else {
            if (Validator.Var(req)) {
                reqObj.bodyPatterns = (headers['content-type'] === "application/xml" && typeof (req) === "string") ?
                    [{ "equalToXml": req }] :
                    this.ObjToJsonPath(req);
            }
            reqObj.urlPathPattern = api.replace(/\*/g, ".*")
        }
        return reqObj
    }
    private static QueryPattern(req: Record<string, any>): {} {
        const res: Record<string, any> = {}
        for (const key in req) {
            res[key] = {
                "matches": String(req[key])
            }
        }
        return res
    }
    private static ObjToJsonPath(input: {}): {}[] {
        const matchesJsonPathArray: Record<string, any>[] = [];
        if (Array.isArray(input)) {
            for (const obj of input) {
                for (const [key, value] of Object.entries(obj)) {
                    matchesJsonPathArray.push(this.ParsePathJson(key, value))
                }
            }
        } else {
            for (const [key, value] of Object.entries(input)) {
                matchesJsonPathArray.push(this.ParsePathJson(key, value))
            }
        }
        return matchesJsonPathArray;
    }
    private static ParsePathJson(key: any, value: any) {
        if (Array.isArray(value)) {
            const matchesJsonPathStr = `.${key}[?(@ == ${JSON.stringify(value[0])})]`;
            return { matchesJsonPath: `$${matchesJsonPathStr}` }
        } else if (typeof value === "object") {
            const subKeys = Object.keys(value);
            const subValues = Object.values(value);
            const subPath = subKeys.map((subKey, index) => {
                const value = subValues[index]
                const subPush: any = (typeof value === "string") ? `'${value}'` : value
                return `${subKey} == ${subPush}`;
            });
            const matchesJsonPathStr = `.${key}[?(@.${subPath.join(" && @.")})]`;
            return { matchesJsonPath: `$${matchesJsonPathStr}` }
        }
        const matchesJsonPathStr = `.${key} == ${JSON.stringify(value)}`;
        return { matchesJsonPath: `$[?(@${matchesJsonPathStr})]` }
    }

    static get Headers() {
        return this._mappingsDefaultHeader
    }

    static PushUuids(uuid: string) {
        this._uuids.push(uuid)
    }
    static readonly ClearMappingUUIDs = () => {
        for (const uuid of this._uuids) HttpProtocol.REQUEST(this._wiremockURL + uuid, "DELETE")
        this._uuids = []
    }
    static get flagClear(): boolean {
        return this._flagClear
    }
    static set flagClear(val: boolean) {
        this._flagClear = val
    }
}