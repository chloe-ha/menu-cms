import React, { useEffect, useState } from 'react'
import type { RestaurantDto } from '../dto/restaurant.dto';
import { updateRestaurantInfo } from '../api.service';
import Button from '../../../shared/components/Button';

export type RestaurantBasicInfo = Pick<RestaurantDto, 'name' | 'description'>;

type BasicInfoFormProps = {
  data: RestaurantBasicInfo;
  onSubmitSuccessful: () => void;
};
const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onSubmitSuccessful }) => {
  const [formData, setFormData] = useState<RestaurantBasicInfo>(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    updateRestaurantInfo(formData)
      .then(() => {
        onSubmitSuccessful()
      })
      .catch((error) => {
        setError('Failed to update restaurant information: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 w-full border-b py-2">Informations générales</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nom du restaurant</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description (Max 500 caractères)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
            className="mt-1 block w-full"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        {error && <p className="text-red-500 mr-4">{error}</p>}
        <Button type="submit" loading={loading} />
      </div>
    </form>
  )
}

export default BasicInfoForm
