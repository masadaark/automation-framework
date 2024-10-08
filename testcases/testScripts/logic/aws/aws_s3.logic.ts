import { expect } from 'chai';
import { AppSettingModel } from '../../interface/app_setting.model';
import ProtocolHttp from '../../protocol/http.protocol';
import { EnumFilePath } from '../../enum/file_path.enum';
import fs from 'fs';

class AwsLogic {
  private static s3EndPoint: string;

  static Init(cfg: AppSettingModel) {
    this.s3EndPoint = cfg?.aws?.s3 ?? '';
  }

  static async UpLoadFileToS3(bucketName: string, s3Key: string, file: string) {
    if (!this.s3EndPoint) throw Error('ไม่พบ s3 enpoint app-setting.json{aws.s3:??}');
    s3Key = encodeURIComponent(s3Key)
    const filPath = `${EnumFilePath.PAYLOAD_FOLDER}/aws/s3/${file}`;
    const form = new FormData();
    form.append('file', fs.createReadStream(filPath));
    const resp = await fetch(`${this.s3EndPoint}/${bucketName}/${s3Key}?x-id=PutObject`, {
      method: 'PUT',
      headers: {
        'content-type': 'multipart/form-data',
      },
      body: form
    });
    expect(resp.status,`s3_key:${s3Key} put status`).eq(200)
  }

  static async GetObjectFromS3(bucketName: string, s3Key: string) {
    const resp = await ProtocolHttp.REQUEST('GET', `${this.s3EndPoint}/${bucketName}/${s3Key}?x-id=GetObject`, {
      'content-type': 'text/plain',
    });
    console.log(resp);
  }
}

export default AwsLogic;
