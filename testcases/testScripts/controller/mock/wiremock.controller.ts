import { binding, given } from "cucumber-tsflow";
import Cfg from "../../class/config.class";
import FileReaderLogic from "../../logic/file_reader.logic";
import { ScenarioWiremock, WiremockFile } from "../../interface/file_interface/wiremock.model";
import Obj from "../../util/object.util";
import TcClass from "../../class/test_cases.class";
import WiremockLogic from "../../logic/mock/wiremock.logic";
import VFormatter from "../../class/formatter.class";


@binding()
export class WiremockController {
    @given('StepDef.{string} fileName.{string} Post Mapping', { timeout: Cfg.stepTimeOut })
    public async PostMappingWithComment(_des: string, file: string): Promise<void> {
        await this.POST(file)
    }
    @given('{string} Post Mapping', { timeout: Cfg.stepTimeOut })
    @given('{string} Post Xml Mapping', { timeout: Cfg.stepTimeOut })
    public async POST(file: string) {
        const wiremockFile: WiremockFile = await FileReaderLogic.JsonPayload(file);
        const mappings: ScenarioWiremock[] = Obj.New(wiremockFile.scenarios.filter(o => o.tcNo.includes(TcClass.tcNo)))
        const promises = mappings.map(async (mapping) => {
            const apiPath = mapping?.paramReplace ? VFormatter.PathReplace(wiremockFile.apiPath, VFormatter.Exec(mapping.paramReplace)) : VFormatter.Exec(wiremockFile.apiPath)
            await WiremockLogic.POST({
                method: wiremockFile.method,
                apiPath,
                request: VFormatter.Exec(mapping.request) ?? [],
                response: VFormatter.Exec(mapping.response),
                paramType: mapping.paramType ?? "",
                headers: mapping.headers ?? {}
            })
        });
        await Promise.all(promises);
    }
    @given('Clear Mapping Server', { timeout: Cfg.stepTimeOut })
    public ClearingMock() {
        WiremockLogic.ClearMappingUUIDs()
    }
    @given('Save WireMock Content for Next Scenario', { timeout: Cfg.stepTimeOut })
    public NonClearingMock() {
        WiremockLogic.flagClear = false
    }
    @given('Mapping method:{string} api:{string} wiremock:{string}', { timeout: Cfg.stepTimeOut })
    public async MockCollection(method: string, apiPath: string, fileName: string) {
        const mappingContent = await FileReaderLogic.ReadWiremockCollection(fileName)
        await WiremockLogic.POST({
            method,
            apiPath,
            request: {},
            response: VFormatter.Exec(mappingContent),
            headers: {},
            paramType: ""
        })
    }
    @given('StepDef.{string} fileName.{string} Post Xml Mapping', { timeout: Cfg.stepTimeOut })
    public async PostMappingXML(_: string, file: string) {
        await this.POST(file)
    }
    @given('Mapping method:{string} api:{string} xml:{string}', { timeout: Cfg.stepTimeOut })
    public async PostMappingXMLCollection(method: string, apiPath: string, fileName: string) {
        const mappingContent = await FileReaderLogic.ReadWiremockCollection(fileName)
        await WiremockLogic.POST({
            method,
            apiPath,
            request: {},
            response: {
                headers: { 'content-type': "application/xml" },
                body: mappingContent,
                status: 200
            },
            headers: { 'content-type': "application/xml" },
            paramType: ""
        })
    }
}