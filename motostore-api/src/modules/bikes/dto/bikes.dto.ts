import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BikeColor, Manufacturer } from '@prisma/client';

export class CreateBikeDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsEnum(Manufacturer)
  manufacturer: Manufacturer;

  @IsEnum(BikeColor)
  color: BikeColor;

  @IsInt()
  @Min(50)
  engineCapacity: number;

  @IsInt()
  @Min(1)
  horsePower: number;

  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
