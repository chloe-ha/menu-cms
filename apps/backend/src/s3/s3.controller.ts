import {
  Body,
  Controller,
  Delete,
  ParseArrayPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GenerateSignedUrlsDto } from './dto/generate-signed-urls.dto';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('signed-urls')
  async getSignedUrl(@Body(ValidationPipe) generateSignedUrlsDto: GenerateSignedUrlsDto) {
    return this.s3Service.generatePutPresignedUrls(generateSignedUrlsDto);
  }

  @Delete('files')
  async deleteS3File(
    @Query('keys', new ParseArrayPipe({ items: String, separator: ',' }))
    keys: string[],
  ) {
    return this.s3Service.deleteFiles(keys);
  }
}
