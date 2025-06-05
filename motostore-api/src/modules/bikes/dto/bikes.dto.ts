import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { BikeColor, Manufacturer, ListingStatus } from '@prisma/client';

export class CreateBikeRequestBodyDto {
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

  @IsBoolean()
  used: boolean;

  @IsBoolean()
  isForParts: boolean;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(ListingStatus)
  @IsOptional()
  listingStatus?: ListingStatus;

  @IsOptional()
  @Min(0)
  initialPrice?: number;
}
