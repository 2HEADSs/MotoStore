import { ApiProperty } from '@nestjs/swagger';
import { ListingStatus } from '@prisma/client';

export class BikeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  manufacturer: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  engineCapacity: number;

  @ApiProperty()
  horsePower: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  used: boolean;

  @ApiProperty()
  isForParts: boolean;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ enum: ListingStatus })
  listingStatus: ListingStatus;

  @ApiProperty({ description: 'Latest price as string' })
  price: string;

  @ApiProperty({ type: [String], description: 'IDs of users who liked this bike' })
  likedByUsers: string[];
}