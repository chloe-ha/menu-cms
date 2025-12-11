export interface TimeWindowDto {
  from: string;
  to: string;
}

export interface OpeningDayDto {
  day: string;
  open: boolean;
  windows: TimeWindowDto[];
}

export interface RestaurantDto {
  name: string;
  images: string[];
  description?: string;
  address?: string;
  openingHours: OpeningDayDto[];
  phoneNumber?: string;
}
