import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike, ListingStatus } from '@prisma/client';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { OwnerListingStatus, UpdateBikeDto } from '../dto/updateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';

@Injectable()
export class BikesService {
  constructor(
    private db: DatabaseService,
    private readonly bikeRepo: BikeRepository,
  ) {}

  async createBike(
    userId: string,
    data: CreateBikeRequestBodyDto,
  ): Promise<Bike & { price: string }> {
    const { price, ...bikeData } = data;
    try {
      const bike = await this.db.bike.create({
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
        include: {
          price: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { price: true },
          },
        },
      });
      return { ...bike, price: bike.price[0].price.toString() };
    } catch (error) {
      console.error('Error creating bike:', error);
      throw new InternalServerErrorException('Failed to create bike');
    }
  }

  async findAllByStatus(status: ListingStatus): Promise<Bike[]> {
    const bikes = await this.db.bike.findMany({
      where: { listingStatus: status },
      orderBy: { createdAt: 'desc' },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true },
        },
      },
    });
    return bikes.map((b) => ({
      ...b,
      price: b.price[0].price,
    }));
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
            select: { price: true },
          },
        },
      });
      return bikes.map((b) => ({
        ...b,
        price: b.price[0].price,
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
        return this.bikeRepo.findByIdWithLatestPrice(bikeId, tx);
      });
    } catch (error) {
      console.log('Error updating bike:', error);
      throw new InternalServerErrorException('Failed to update bike');
    }
  }

  async getOneBike(
    bikeId: string,
    userId: string | null,
  ): Promise<Bike & { price: string }> {
    const bike = await this.db.bike.findUnique({
      where: { id: bikeId },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          select: { price: true, createdAt: true },
        },
      },
    });

    if (!bike) {
      throw new NotFoundException('Bike not found');
    }

    // console.log('user', userId);

    const isOwner = !!userId && userId === bike.ownerId;
    const isPublic =
      bike.listingStatus === ListingStatus.ACTIVE ||
      bike.listingStatus === ListingStatus.SOLD;
    if (!isOwner && !isPublic) {
      throw new ForbiddenException({
        message: 'You are not allowed to view this bike',
        status: 403,
      });
    }
    bike;
    return { ...bike, price: bike.price[0].price.toString() };
  }

  async likeBike(
    bikeId: string,
    userId: string,
  ): Promise<Bike & { price: string }> {
    const bike = await this.db.bike.findUnique({
      where: { id: bikeId },
    });

    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    const isPublic =
      bike.listingStatus === ListingStatus.ACTIVE ||
      bike.listingStatus === ListingStatus.SOLD;
    const isOwner = bike.ownerId === userId;
    if (!isPublic || isOwner) {
      throw new ForbiddenException({
        message: 'You are not allowed to like this bike',
        status: 403,
      });
    }

    const updatedBike = await this.db.bike.update({
      where: { id: bikeId },
      data: { likedByUsers: { connect: { id: userId } } },
      include: {
        likedByUsers: { select: { id: true } },
        price: {
          orderBy: { createdAt: 'desc' },
          select: { price: true, createdAt: true },
        },
      },
    });

    return { ...updatedBike, price: updatedBike.price[0].price.toString() };
  }

  async unlikeBike(
    bikeId: string,
    userId: string,
  ): Promise<Bike & { price: string }> {
    const bike = await this.db.bike.findUnique({
      where: { id: bikeId },
      include: { likedByUsers: { select: { id: true } } },
    });
    if (!bike) throw new NotFoundException('Bike not found');
    const isPublic =
      bike.listingStatus === ListingStatus.ACTIVE ||
      bike.listingStatus === ListingStatus.SOLD;
    const isOwner = bike.ownerId === userId;
    if (!isPublic || isOwner) {
      throw new ForbiddenException({
        message: 'You are not allowed to unlike this bike',
        status: 403,
      });
    }

    if (!bike.likedByUsers.some((user) => user.id === userId)) {
      throw new ForbiddenException({
        message: 'You are not allowed to unlike this bike',
        status: 403,
      });
    }
    const updatedBike = await this.db.bike.update({
      where: { id: bikeId },
      data: { likedByUsers: { disconnect: { id: userId } } },
      include: {
        likedByUsers: { select: { id: true } },
        price: {
          orderBy: { createdAt: 'desc' },
          select: { price: true, createdAt: true },
        },
      },
    });
    return { ...updatedBike, price: updatedBike.price[0].price.toString() };
  }

  async allLikedBikes(userId: string): Promise<Bike[]> {
    const bikes = await this.db.bike.findMany({
      where: { likedByUsers: { some: { id: userId } } },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true },
        },
      },
    });
    return bikes.map((b) => ({
      ...b,
      price: b.price[0].price.toString(),
    }));
  }
}
