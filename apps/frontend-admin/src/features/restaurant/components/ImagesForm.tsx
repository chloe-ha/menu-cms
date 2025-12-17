import React, { useEffect, useState } from 'react'
import type { RestaurantDto } from '../dto/restaurant.dto';
import ImageUpload, { type ImageItem } from '../../../shared/components/ImageUpload';
import { deleteS3Files, getSignedUrls, S3BaseUrl, uploadFileToS3 } from '../../../shared/services/s3.service';
import { updateRestaurantInfo } from '../api.service';
import Button from '../../../shared/components/Button';

export type RestaurantImages = Pick<RestaurantDto, 'images'>;

type ImagesFormProps = {
  data: RestaurantImages;
  onSubmitSuccessful: () => void;
};
const ImagesForm: React.FC<ImagesFormProps> = ({ data, onSubmitSuccessful }) => {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setImageItems(data.images.map(s3Key => ({
      id: crypto.randomUUID(),
      type: 's3',
      s3Key,
      previewUrl: S3BaseUrl + s3Key,
    })));
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedItems = [...imageItems];
      const filesToUpload = imageItems.filter(item => item.type === 'file');
      const filesToDelete = imageItems.filter(item => item.type === 's3').filter(item => item.isPendingDelete);

      const signedUrls = await getSignedUrls({ files: filesToUpload.map(file => ({ filename: file.file.name, contentType: file.file.type })) });

      if (filesToUpload.length !== signedUrls.length) {
        throw new Error(`Couldn't generate signedUrls for all files to update`);
      }

      for (let i = 0; i < filesToUpload.length; i++) {
        const { signedUrl, key } = signedUrls[i];
        await uploadFileToS3(signedUrl, filesToUpload[i].file);
        updatedItems = updatedItems.map(item => item.id === filesToUpload[i].id ? {...item, type: 's3', s3Key: key }: item)
      }

      await deleteS3Files(filesToDelete.map(item => item.s3Key))
      updatedItems = updatedItems.filter(item => item.type === 's3').filter(item => !item.isPendingDelete);

      await updateRestaurantInfo({ images: updatedItems.filter(item => item.type === 's3').map(item => item.s3Key) });

      onSubmitSuccessful();
    } catch (error) {
      setError('Error updating the images');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 w-full border-b py-2">Images</h2>
      <ImageUpload
        id="images"
        value={imageItems}
        onChange={setImageItems}
      />
      <div className="flex justify-end pt-4">
        {error && <p className="text-red-500 mr-4">{error}</p>}
        <Button type="submit" loading={loading} />
      </div>
    </form>
  )
}

export default ImagesForm
