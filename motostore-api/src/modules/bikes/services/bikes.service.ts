import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike, ListingStatus } from '@prisma/client';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { OwnerListingStatus, UpdateBikeDto } from '../dto/updateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BikesService {
  constructor(
    private db: DatabaseService,
    private readonly bikeRepo: BikeRepository,
  ) {}

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
      const bikes = await this.db.bike.findMany({
        where,
        include: {
          price: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { price: true, createdAt: true },
          },
        },
      });
      return bikes.map((b) => ({
        ...b,
        price: b.price.map((p) => ({
          price: (p.price as Decimal).toNumber(),
          createdAt: p.createdAt,
        })),
      }));
    } catch (error) {
      console.error('Error fetching user bikes:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  async updateMyBike(
    ownerId: string,
    bikeId: string,
    data: UpdateBikeDto,
  ): Promise<Bike | null> {
    const bike = await this.db.bike.findUnique({ where: { id: bikeId } });
    if (!bike || bike.ownerId !== ownerId) {
      throw new ForbiddenException('You are not allowed to update this bike');
    }

    const { price, ...bikeData } = data;
    if (bike.listingStatus === ListingStatus.ACTIVE) {
      bikeData.listingStatus = OwnerListingStatus.PENDING_APPROVAL;
    }

    if (
      bike.listingStatus == ListingStatus.SOLD ||
      bike.listingStatus == ListingStatus.UNACTIVE
    ) {
      throw new ForbiddenException({
        message: 'You are not allowed to update this bike',
        status: 403,
      });
    }
    try {
      return await this.db.$transaction(async (tx) => {
        await tx.bike.update({
          where: { id: bikeId },
          data: bikeData,
        });

        if (price !== undefined) {
          await tx.prices.create({
            data: { bikeId, price },
          });
        }
        // console.log(updatedBike);
        return this.bikeRepo.findByIdWithLatestPrice(bikeId, tx);
      });
    } catch (error) {
      console.log('Error updating bike:', error);
      throw new InternalServerErrorException('Failed to update bike');
    }
  }
}
