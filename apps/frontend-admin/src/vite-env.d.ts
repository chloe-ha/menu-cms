/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_AWS_S3_REGION: string;
  readonly VITE_AWS_S3_BUCKET_NAME: string;

  // Add any other VITE_ prefixed variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}