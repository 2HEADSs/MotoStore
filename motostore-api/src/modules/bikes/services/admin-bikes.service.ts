import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';
import { AdminUpdateBikeDto } from '../dto/adminUpdateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AdminBikesService {
  constructor(
    private db: DatabaseService,
    private readonly bikeRepo: BikeRepository,
  ) {}

  async findAll(): Promise<Bike[]> {
    try {
      return await this.db.bike.findMany();
    } catch (error) {
      console.error('Error fetching bikes in admin service:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  async updateBike(
    bikeId: string,
    dto: AdminUpdateBikeDto,
  ): Promise<Bike | null> {
    const { price, ...bikeData } = dto;

    try {
      return this.db.$transaction(async (tx) => {
        await tx.bike.update({
          where: { id: bikeId },
          data: bikeData,
        });
        if (price !== undefined) {
          await tx.prices.create({
            data: {
              bikeId,
              price,
            },
          });
        }
        return this.bikeRepo.findByIdWithLatestPrice(bikeId, tx);
      });
    } catch (error) {
      console.error('Error updating bike in admin service:', error);
      throw new InternalServerErrorException('Failed to update bike');
    }
  }

  async getOneBike(
    bikeId: string,
  ): Promise<Bike & { latestPrice: number | null }> {
    // const bike = await this.db.bike.findUnique({
    //   where: { id: bikeId },
    //   include: {
    //     price: {
    //       orderBy: { createdAt: 'desc' },
    //       take: 1,
    //       select: { price: true },
    //     },
    //   },
    // });
    const bike = await this.bikeRepo.findByIdWithLatestPrice(bikeId);
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return {
      ...bike,
      latestPrice: bike.price.length ? bike.price[0].price : null,
    };
  }
}
