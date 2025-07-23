import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';
import { AdminUpdateBikeDto } from '../dto/adminUpdateBike.dto';

@Injectable()
export class AdminBikesService {
  constructor(private db: DatabaseService) {}

  async findAll(): Promise<Bike[]> {
    try {
      return await this.db.bike.findMany();
    } catch (error) {
      console.error('Error fetching bikes in admin service:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  async updateBike(bikeId: string, dto: AdminUpdateBikeDto): Promise<Bike> {
    const { price, ...bikeData } = dto;

    try {
      return await this.db.$transaction(async (tx) => {
        const updatedBike = await tx.bike.update({
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
        return updatedBike;
      });
    } catch (error) {
      console.error('Error updating bike in admin service:', error);
      throw new InternalServerErrorException('Failed to update bike');
    }
  }
}
