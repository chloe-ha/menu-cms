import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { GenerateSignedUrlsDto } from './dto/generate-signed-urls.dto';
import { SignedUrl } from './entities/signed-url';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly signedUrlExpirySeconds = 300;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    const region = this.configService.get<string>('AWS_S3_REGION');

    // The S3Client automatically looks for credentials in the standard locations:
    // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    // 2. IAM Role associated with the host (EC2, Lambda, ECS)
    this.s3Client = new S3Client({ region });
  }

  /**
   * Generates a Pre-Signed URL for a PUT operation to upload a file.
   * @param filename - The original name of the file (used for file extension).
   * @param contentType - The MIME type of the file (e.g., 'image/jpeg').
   * @returns The signed URL and the final S3 key (DB reference string).
   */
  async generatePutPresignedUrl(filename: string, contentType: string): Promise<SignedUrl> {
    try {
      const fileExtension = filename.split('.').pop();
      const key = `restaurants/images/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.signedUrlExpirySeconds,
      });

      return { signedUrl, key };
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error}`);
      throw new InternalServerErrorException('Failed to generate secure upload URL.');
    }
  }

  /**
   * Generates Pre-Signed URLs for PUT operations to upload a list of files.
   * Calls generatePutPresignedUrl for each file.
   * @param files - List of files { filename: string, contentType: string }[]
   * @returns The signed URL and the final S3 key for all files of fails.
   */
  async generatePutPresignedUrls(
    generateSignedUrlsDto: GenerateSignedUrlsDto,
  ): Promise<SignedUrl[]> {
    const { files } = generateSignedUrlsDto;
    try {
      const promises: Promise<SignedUrl>[] = files.map((file) =>
        this.generatePutPresignedUrl(file.filename, file.contentType),
      );

      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Error generating signed URLs: ${error}`);
      throw new InternalServerErrorException('Failed to generate secure upload URLs.');
    }
  }

  /**
   * Deletes S3 files from keys. Logs error if any unsuccessful, never throws.
   * @param deleteFileDto
   */
  async deleteFiles(keys: string[]) {
    const promises = keys.map((key) => {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return this.s3Client.send(command);
    });

    const result = await Promise.allSettled(promises);
    result.forEach((e, index) => {
      if (e.status === 'rejected') {
        this.logger.error(`Error deleting key: ${keys[index]}`);
      }
    });
  }
}
