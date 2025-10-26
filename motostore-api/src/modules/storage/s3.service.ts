import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly client = new S3Client({
    region: process.env.AWS_REGION,
  });

  async uploadObject(params: {
    key: string;           
    body: Buffer;       
    contentType: string;  
  }) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    );

    const base =
      process.env.AWS_S3_PUBLIC_BASE ??
      `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    return { key: params.key, url: `${base}/${params.key}` };
  }
}
