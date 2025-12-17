import axiosService from "../axios.service";

export const S3BaseUrl = `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_S3_REGION}.amazonaws.com/`;

export type FileDto = {
  filename: string;
  contentType: string;
}
export type GenerateSignedUrlDto = {
  files: FileDto[];
}
export type SignedUrl = {
  signedUrl: string;
  key: string;
};

export async function getSignedUrls(generateSignedUrlDto: GenerateSignedUrlDto): Promise<SignedUrl[]> {
  if (generateSignedUrlDto.files.length === 0) {
    return [];
  }
  const response = await axiosService.post('/s3/signed-urls', generateSignedUrlDto);
  return response.data
}

export async function uploadFileToS3(signedUrl: string, file: File): Promise<void> {
  await axiosService.put(signedUrl, file, { headers: { "Content-Type": file.type } })
}

export async function deleteS3Files(keys: string[]) {
  if (keys.length === 0) return;
  const uri = `/s3/files?keys=${keys.join(',')}`;
  await axiosService.delete(uri);
}
