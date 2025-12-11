import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class TimeWindowDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format (e.g., 14:30)',
  })
  from: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format (e.g., 14:30)',
  })
  to: string;
}

export class OpeningDayDto {
  @IsString()
  @IsNotEmpty()
  day: string;

  @IsBoolean()
  open: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TimeWindowDto)
  windows: TimeWindowDto[];
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OpeningDayDto)
  openingHours?: OpeningDayDto[];

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
