import { binding, given, when } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import AwsLogic from '../../logic/aws/aws_s3.logic';

@binding()
export class AwsS3Controller {
  @given('Vars {string} should Contains {string}', { timeout: Cfg.stepTimeOut })
  public async UploadFileToS3(bucketName: string, s3Key: string, file: string): Promise<void> {
    await AwsLogic.UpLoadFileToS3(bucketName, s3Key, file);
  }
  @when('Get AwsS3 Bucket:{string} Key:{string} === File:{string}', { timeout: Cfg.stepTimeOut })
  public async GetObjectFormS3(bucketName: string, s3Key: string, file: string): Promise<void> {
    await AwsLogic.GetObjectFromS3(bucketName, s3Key);
  }
}
