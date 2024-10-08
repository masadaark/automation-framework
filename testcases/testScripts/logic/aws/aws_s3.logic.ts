import { AppSettingModel } from '../../interface/app_setting.model';
import ProtocolHttp from '../../protocol/http.protocol';
import FileU from '../../util/file.util';

class AwsLogic {
  private static s3EndPoint: string;

  static Init(cfg: AppSettingModel) {
    this.s3EndPoint = cfg?.aws?.s3 ?? '';
  }

  static async UpLoadFileToS3(bucketName: string, s3Key: string, file: string) {
    if (!this.s3EndPoint) throw Error('ไม่พบ s3 enpoint app-setting.json{aws.s3:??}');
    const fileContent = FileU.readJson(`aws/s3/${file}`);
    await ProtocolHttp.REQUEST(
      'PUT',
      `${this.s3EndPoint}/${bucketName}/${s3Key}?x-id=PutObject`,
      {
        'content-type': 'multipart/form-data',
      },
      fileContent
    );
  }

  static async GetObjectFromS3(bucketName: string, s3Key: string) {
    const resp = await ProtocolHttp.REQUEST('GET', `${this.s3EndPoint}/${bucketName}/${s3Key}?x-id=GetObject`, {
      'content-type': 'text/plain',
    });
    console.log(resp);
  }
}

export default AwsLogic;
