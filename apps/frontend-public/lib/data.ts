interface TimeWindowDto {
  from: string;
  to: string;
}

interface OpeningDayDto {
  day: string;
  open: boolean;
  windows: TimeWindowDto[];
}

interface RestaurantDto {
  name?: string;
  images: string[];
  description?: string;
  address?: string;
  openingHours: OpeningDayDto[];
  phoneNumber?: string;
}

export async function getRestaurantData(): Promise<RestaurantDto> {
  const fetchUrl = `${process.env.BACKEND_API_URL}/restaurants/693b60888a60d3cb46093b86`;
  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch restaurant data');
  }
  const restaurant: RestaurantDto = await res.json();
  return restaurant;
}
