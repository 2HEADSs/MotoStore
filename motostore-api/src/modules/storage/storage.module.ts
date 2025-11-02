import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FilesController } from './files.controller';

@Module({
  providers: [S3Service],
  controllers: [FilesController],
  exports: [S3Service],
})
export class StorageModule {}
