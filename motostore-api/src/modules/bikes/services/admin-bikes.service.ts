import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';
import { AdminUpdateBikeDto } from '../dto/adminUpdateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';

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
}
