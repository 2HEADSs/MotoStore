import { ApiPropertyOptional } from '@nestjs/swagger';
import { BikeColor, ListingStatus, Manufacturer } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class AdminUpdateBikeDto {
  @ApiPropertyOptional({ example: 'Xtreme Enduro 300' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ enum: Manufacturer, example: Manufacturer.KTM })
  @IsOptional()
  @IsEnum(Manufacturer)
  manufacturer?: Manufacturer;

  @ApiPropertyOptional({ enum: BikeColor, example: BikeColor.BLACK })
  @IsOptional()
  @IsEnum(BikeColor)
  color?: BikeColor;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(10000)
  engineCapacity?: number;

  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  horsePower?: number;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  used?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isForParts?: boolean;

  @ApiPropertyOptional({ example: 'Excellent condition' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Sofia, Bulgaria' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    type: [String],
    maxItems: 10,
    description: 'Array of up to 10 image URLs',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 7200 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @ApiPropertyOptional({ enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  listingStatus?: ListingStatus;

  @ApiPropertyOptional({ example: 'uuid-of-new-owner' })
  @IsOptional()
  @IsString()
  ownerId?: string;
}
