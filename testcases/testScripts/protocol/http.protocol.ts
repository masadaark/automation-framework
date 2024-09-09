import request from 'supertest';
import Cfg from '../class/config.class';

class HttpClass {

    static async REQUEST(apiPath: string, method: string, headers: Record<string, any> = {}, body?: any): Promise<any> {
        const url: string = apiPath.startsWith("/") ? apiPath : `${Cfg.appSetting.baseUrl}/${apiPath}`;
        console.warn(Cfg.appSetting)
        try {
            let response;
            
            switch (method.toUpperCase()) {
                case 'GET':
                    response = await request("")
                        .get(url)
                        .set(headers)
                        .send(body);
                    break;
                case 'POST':
                    response = await request("")
                        .post(url)
                        .set(headers)
                        .send(body);
                    break;
                case 'PUT':
                    response = await request("")
                        .put(url)
                        .set(headers)
                        .send(body);
                    break;
                case 'DELETE':
                    response = await request("")
                        .delete(url)
                        .set(headers)
                        .send(body);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            return response.body;
        } catch (error) {
            console.warn(`*** Request failed ***`);
            console.warn(error);
        }
        return;
    }
}

export default HttpClass;
