import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BikeColor, ListingStatus, Manufacturer } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

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
