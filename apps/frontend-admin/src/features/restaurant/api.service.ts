import { plainToInstance } from "class-transformer";
import axiosService from "../../shared/axios.service";
import { type RestaurantDto } from "./dto/restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { validate } from "class-validator";

export async function fetchRestaurantInfo(): Promise<RestaurantDto> {
  const restaurantInfo = await axiosService.get<RestaurantDto>('/restaurants/693b60888a60d3cb46093b86');
  return restaurantInfo.data;
}

export async function updateRestaurantInfo(data: UpdateRestaurantDto) {
  const dtoInstance = plainToInstance(UpdateRestaurantDto, data);

  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorString = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
    throw new Error(errorString);
  }

  await axiosService.patch<RestaurantDto>('/restaurants/693b60888a60d3cb46093b86', data);
}