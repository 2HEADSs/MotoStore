import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike, ListingStatus } from '@prisma/client';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { OwnerListingStatus, UpdateBikeDto } from '../dto/updateBike.dto';

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
      return await this.db.bike.findMany({
        where,
        include: {
          price: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { price: true, createdAt: true },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching user bikes:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  async updateMyBike(
    ownerId: string,
    bikeId: string,
    data: UpdateBikeDto,
  ): Promise<Bike> {
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
        const updatedBike = await tx.bike.update({
          where: { id: bikeId },
          data: bikeData,
        });

        if (price !== undefined) {
          await tx.prices.create({
            data: { bikeId, price },
          });
        }
        return updatedBike;
      });
    } catch (error) {
      console.log('Error updating bike:', error);
      throw new InternalServerErrorException('Failed to update bike');
    }
  }
}
