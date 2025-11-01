import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { randomUUID } from 'crypto';
import type { Express } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly s3: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOne(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');


    if (!/^image\/(png|jpe?g|webp)$/i.test(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const key = `uploads/${randomUUID()}.${ext}`;

    const { url } = await this.s3.uploadObject({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    return { url, key };
  }
}
