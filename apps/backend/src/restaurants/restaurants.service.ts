import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private readonly configService: ConfigService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const createdRestaurant = new this.restaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  async findAll() {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      this.logger.error(`Restaurant with ID ${id} not found`);
      return null;
    }
    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    await this.restaurantModel.findByIdAndUpdate(id, updateRestaurantDto, { new: true }).exec();
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      const revalidateUrl = `${this.configService.get<string>('NEXT_API_URL')}/revalidate`;
      const response = await fetch(revalidateUrl);
      if (!response.ok) {
        const errorMessage = `Restaurant with ID ${id} updated but failed to trigger revalidation`;
        this.logger.error(`${errorMessage}: ${revalidateUrl}`);
        throw new HttpException(errorMessage, response.status);
      }
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }
}
