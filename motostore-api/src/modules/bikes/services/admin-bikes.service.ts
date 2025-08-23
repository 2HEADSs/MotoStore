import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike, ListingStatus, User } from '@prisma/client';
import { AdminUpdateBikeDto } from '../dto/adminUpdateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AdminBikesService {
  constructor(
    private db: DatabaseService,
    private readonly bikeRepo: BikeRepository,
  ) {}

  async findAll(status?: ListingStatus): Promise<Bike[]> {
    try {
      const where = status ? { listingStatus: status } : undefined;
      const bikes = await this.db.bike.findMany({
        where,
        include: {
          price: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { price: true, createdAt: true, updatedAt: true },
          },
        },
      });
      return bikes;
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
    const bike = await this.db.bike.findUnique({
      where: { id: bikeId },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true },
        },
      },
    });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    return {
      ...bike,
      latestPrice:
        bike.price.length > 0
          ? (bike.price[0].price as Decimal).toNumber()
          : null,
    };
  }

  async updateBikeStatus(
    bikeId: string,
    status: ListingStatus,
  ): Promise<Bike & { latestPrice: number | null }> {
    try {
      await this.db.bike.update({
        where: { id: bikeId },
        data: { listingStatus: status },
      });
    } catch (err) {
      if (err?.code === 'P2025') {
        throw new NotFoundException('Bike not found');
      }
      console.error('Error updating bike status in admin service:', err);
      throw new InternalServerErrorException('Failed to update bike status');
    }
    return this.getOneBike(bikeId);
  }
}
