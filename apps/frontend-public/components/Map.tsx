import React from 'react';

const Map: React.FC = () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.RESTAURANT_PLACE_ID;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`;

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
      <iframe
        title="Restaurant Localisation"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      />
    </div>
  );
};

export default Map;