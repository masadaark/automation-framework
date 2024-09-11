import Cfg from '../class/config.class';

class HttpClass {

    static async REQUEST(apiPath: string, method: string, headers: Record<string, any> = {}, body?: any): Promise<Response | undefined> {
        const url: string = apiPath.startsWith("/") ? apiPath : `${Cfg.appSetting.baseUrl}/${apiPath}`;
        console.warn(`${method} : ${url}`);
        
        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
            });
            return response; 
        } catch (error) {
            console.error('http request errors:', error);
        }
        return undefined;
    }
}

export default HttpClass;
