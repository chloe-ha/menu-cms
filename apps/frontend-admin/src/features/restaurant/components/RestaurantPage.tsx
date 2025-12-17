import React, { useEffect, useState } from 'react'
import BasicInfoForm, { type RestaurantBasicInfo } from './BasicInfoForm';
import type { RestaurantDto } from '../dto/restaurant.dto';
import { fetchRestaurantInfo } from '../api.service';
import axios from 'axios';
import ImagesForm from './ImagesForm';

const RestaurantPage: React.FC = () => {
  const [formData, setFormData] = useState<RestaurantDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = async () => {
    try {
      const data = await fetchRestaurantInfo()
      setFormData(data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.error("Request cancelled", err);
        return;
      }
      console.error("Error fetching restaurant info:", err);
      setError("Could not load current restaurant data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const extractBasicInfo = (data: RestaurantDto): RestaurantBasicInfo => {
    return {
      name: data.name,
      description: data.description,
    };
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        🍽️ Restaurant Information Management
      </h1>
      {loading && <p>Loading restaurant data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && formData == null && <p>No restaurant data available.</p>}
      {!loading && !error && formData != null && (
        <React.Fragment>
          <BasicInfoForm data={extractBasicInfo(formData)} onSubmitSuccessful={fetchInfo} />
          <ImagesForm data={{ images: formData.images }} onSubmitSuccessful={fetchInfo} />
        </React.Fragment>
      )}
    </div>
  );
};

export default RestaurantPage