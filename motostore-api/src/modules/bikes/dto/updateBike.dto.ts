import { ApiPropertyOptional } from '@nestjs/swagger';
import { BikeColor, Manufacturer } from '@prisma/client';
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

export enum OwnerListingStatus {
  DRAFT = 'DRAFT',
  SOLD = 'SOLD',
}

export class UpdateBikeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ enum: Manufacturer })
  @IsOptional()
  @IsEnum(Manufacturer)
  manufacturer?: Manufacturer;

  @ApiPropertyOptional({ enum: BikeColor })
  @IsOptional()
  @IsEnum(BikeColor)
  color?: BikeColor;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(10000)
  engineCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  horsePower?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() used?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isForParts?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;

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
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @ApiPropertyOptional({ example: 5500.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @ApiPropertyOptional({ enum: OwnerListingStatus })
  @IsOptional()
  @IsEnum(OwnerListingStatus, { message: 'Status must be DRAFT or SOLD' })
  listingStatus?: OwnerListingStatus;
}
