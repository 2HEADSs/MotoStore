import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBikeRequestBodyDto } from '../dto/bikes.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike, ListingStatus } from '@prisma/client';

@Injectable()
export class BikesService {
  constructor(private db: DatabaseService) {}

  async createBike(
    userId: string,
    data: CreateBikeRequestBodyDto,
  ): Promise<Bike> {
    const { price, ...bikeData } = data;
    try {
      return await this.db.bike.create({
        data: {
          ownerId: userId,
          ...bikeData,
          ...(price !== undefined && {
            price: {
              create: {
                price,
              },
            },
          }),
        },
      });
    } catch (error) {
      console.error('Error creating bike:', error);
      throw new InternalServerErrorException('Failed to create bike');
    }
  }

  async findAll(status?: ListingStatus): Promise<Bike[]> {
    const allowedStatuses: ListingStatus[] = [
      ListingStatus.ACTIVE,
      ListingStatus.SOLD,
    ];
    if (status && !allowedStatuses.includes(status)) {
      return [];
    }
    try {
      return await this.db.bike.findMany({
        where: status
          ? { listingStatus: status }
          : { listingStatus: ListingStatus.ACTIVE },
      });
    } catch (error) {
      console.error('Error fetching bikes:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  async findMyBikes(userId: string, status?: ListingStatus): Promise<Bike[]> {
    try {
      const where = status
        ? {
            ownerId: userId,
            listingStatus: status,
          }
        : { ownerId: userId };
      return await this.db.bike.findMany({ where });
    } catch (error) {
      console.error('Error fetching user bikes:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }
}
