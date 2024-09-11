import { AppSettingModel } from "../interface/app_setting.model";

class Cfg {
    private static _stepTimeOut: number = 90 * 1000
    private static _appSetting: AppSettingModel
    static get appSetting(): AppSettingModel {
        return this._appSetting
    }
    static set appSetting(v: AppSettingModel) {
        this._appSetting = v
    }
    static get stepTimeOut(): number {
        return this._stepTimeOut
    }
}

export default Cfg