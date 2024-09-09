import { AppSettingModel } from "../interface/app_setting.model";

class Cfg {
    private static _appSetting: AppSettingModel
    static get appSetting(): AppSettingModel {
        return this._appSetting
    }
    static set appSetting(v: AppSettingModel) {
        this._appSetting = v
    }
}

export default Cfg