import { Injectable } from '@nestjs/common';
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

    return this.db.bike.create({
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
  }

  async findAll(): Promise<Bike[]> {
    return this.db.bike.findMany({
      where: {
        listingStatus: ListingStatus.ACTIVE,
      },
    });
  }
}
