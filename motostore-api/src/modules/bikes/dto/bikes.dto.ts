import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
  IsArray,
  IsIn,
} from 'class-validator';
import { BikeColor, Manufacturer, ListingStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBikeRequestBodyDto {
  @ApiProperty({ example: 'CBR600RR' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ enum: Manufacturer, example: Manufacturer.Honda })
  @IsEnum(Manufacturer)
  manufacturer: Manufacturer;

  @ApiProperty({ enum: BikeColor })
  @IsEnum(BikeColor)
  color: BikeColor;

  @ApiProperty({ example: 600, minimum: 50 })
  @IsInt()
  @Min(50)
  engineCapacity: number;

  @ApiProperty({ example: 120, minimum: 1 })
  @IsInt()
  @Min(1)
  horsePower: number;

  @ApiProperty({ example: 2020, minimum: 1900 })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  used: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  isForParts: boolean;

  @ApiProperty({ example: 'Sofia, Bulgaria' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'Well maintained bike in great condition.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: ['image1.jpg', 'image2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ enum: ListingStatus })
  @IsEnum(ListingStatus)
  @IsOptional()
  listingStatus?: ListingStatus;

  @ApiPropertyOptional({ example: 4500, minimum: 0 })
  @IsOptional()
  @Min(0)
  price?: number;
}

const ALLOWED_STATUSES = [ListingStatus.ACTIVE, ListingStatus.SOLD] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];
export class BikeStatusFilterDto {
  @ApiPropertyOptional({
    enum: ALLOWED_STATUSES,
    description: 'Optional status filter',
  })
  @IsOptional()
  @IsIn(ALLOWED_STATUSES, { message: 'Invalid listing status' })
  status?: AllowedStatus;
}

export class MyBikesStatusFilterDto {
  @ApiPropertyOptional({
    enum: ListingStatus,
    description: 'Optional status filter',
  })
  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Invalid listing status' })
  status?: ListingStatus;
}
