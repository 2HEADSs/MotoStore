import { Injectable } from '@nestjs/common';
import { CreateBikeRequestBodyDto } from '../dto/bikes.dto';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';

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
        listingStatus: 'ACTIVE',
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
}
