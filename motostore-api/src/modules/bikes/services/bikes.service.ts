import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { ListingStatus } from '@prisma/client';
import { CreateBikeRequestBodyDto } from '../dto/createBike.dto';
import { OwnerListingStatus, UpdateBikeDto } from '../dto/updateBike.dto';
import { BikeRepository } from '../repositories/bike.repository';
import { BikeWithMeta } from '../types/bikes-with-meta.type';

const BIKE_META_INCLUDE = {
  price: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    select: { price: true },
  },
  likedByUsers: { select: { id: true } },
} as const;

@Injectable()
export class BikesService {
  constructor(
    private db: DatabaseService,
    private readonly bikeRepo: BikeRepository,
  ) {}

  async createBike(
    userId: string,
    data: CreateBikeRequestBodyDto,
  ): Promise<BikeWithMeta> {
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
        include: BIKE_META_INCLUDE,
      });
      return {
        ...bike,
        price: bike.price[0].price.toString(),
        likedByUsers: bike.likedByUsers.map((u) => u.id),
      };
    } catch (error) {
      console.error('Error creating bike:', error);
      throw new InternalServerErrorException('Failed to create bike');
    }
  }

  async findAllByStatus(status: ListingStatus): Promise<BikeWithMeta[]> {
    const bikes = await this.db.bike.findMany({
      where: { listingStatus: status },
      orderBy: { createdAt: 'desc' },
      include: BIKE_META_INCLUDE,
    });
    return bikes.map((b) => ({
      ...b,
      price: b.price[0].price.toString(),
      likedByUsers: b.likedByUsers.map((u) => u.id),
    }));
  }

  async findMyBikes(
    userId: string,
    status?: ListingStatus,
  ): Promise<BikeWithMeta[]> {
    try {
      const where = status
        ? {
            ownerId: userId,
            listingStatus: status,
          }
        : { ownerId: userId };
      const bikes = await this.db.bike.findMany({
        where,
        include: BIKE_META_INCLUDE,
      });
      return bikes.map((b) => ({
        ...b,
        price: b.price[0].price.toString(),
        likedByUsers: b.likedByUsers.map((u) => u.id),
      }));
    } catch (error) {
      console.error('Error fetching user bikes:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }

  // async updateMyBikeOld(
  //   ownerId: string,
  //   bikeId: string,
  //   data: UpdateBikeDto,
  // ): Promise<BikeWithMeta> {

  //   const bike = await this.db.bike.findUnique({ where: { id: bikeId } });
  //   if (!bike || bike.ownerId !== ownerId) {
  //     throw new ForbiddenException('You are not allowed to update this bike');
  //   }

  //   const { price, ...bikeData } = data;
  //   if (bike.listingStatus === ListingStatus.ACTIVE) {
  //     bikeData.listingStatus = OwnerListingStatus.PENDING_APPROVAL;
  //   }

  //   if (
  //     bike.listingStatus == ListingStatus.SOLD ||
  //     bike.listingStatus == ListingStatus.UNACTIVE
  //   ) {
  //     throw new ForbiddenException({
  //       message: 'You are not allowed to update this bike',
  //       status: 403,
  //     });
  //   }
  //   try {
  //     return await this.db.$transaction(async (tx) => {
  //       await tx.bike.update({
  //         where: { id: bikeId },
  //         data: bikeData,
  //       });

  //       if (price !== undefined) {
  //         await tx.prices.create({
  //           data: { bikeId, price },
  //         });
  //       }
  //       const updatedBike = await this.bikeRepo.findByIdWithLatestPrice(
  //         bikeId,
  //         tx,
  //       );
  //       if (!updatedBike) {
  //         throw new InternalServerErrorException(
  //           'Bike update failed unexpectedly',
  //         );
  //       }
  //       return updatedBike;
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to update bike');
  //   }
  // }

  async updateMyBike(
    ownerId: string,
    bikeId: string,
    data: UpdateBikeDto,
  ): Promise<BikeWithMeta> {
    try {
      return await this.db.$transaction(async (tx) => {
        const current = await tx.bike.findUnique({
          where: { id: bikeId },
          select: { ownerId: true, listingStatus: true },
        });

        if (!current || current.ownerId !== ownerId) {
          throw new ForbiddenException(
            'You are not allowed to update this bike',
          );
        }

        if (
          current.listingStatus === ListingStatus.SOLD ||
          current.listingStatus === ListingStatus.UNACTIVE
        ) {
          throw new ForbiddenException(
            'You are not allowed to update this bike',
          );
        }

        const { price, ...bikeData } = data;

        const nextStatus =
          current.listingStatus === ListingStatus.ACTIVE
            ? OwnerListingStatus.PENDING_APPROVAL
            : undefined;

        const { count } = await tx.bike.updateMany({
          where: {
            id: bikeId,
            ownerId,
            listingStatus: current.listingStatus,
          },
          data: {
            ...bikeData,
            ...(nextStatus ? { listingStatus: nextStatus } : {}),
          },
        });

        if (count === 0) {
          throw new ConflictException(
            'Bike was modified by another process. Please retry.',
          );
        }

        if (price !== undefined) {
          await tx.prices.create({
            data: { bikeId, price },
          });
        }

        const updatedBike = await this.bikeRepo.findByIdWithLatestPrice(
          bikeId,
          tx,
        );
        if (!updatedBike) {
          throw new InternalServerErrorException(
            'Bike update failed unexpectedly',
          );
        }

        return updatedBike;
      });
    } catch (error) {
      // Запази семантиката на 403/409; увий само неочаквани грешки като 500
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update bike');
    }
  }

  async getOneBike(
    bikeId: string,
    userId: string | null,
  ): Promise<BikeWithMeta> {
    const bike = await this.db.bike.findUnique({
      where: { id: bikeId },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          select: { price: true, createdAt: true },
        },
        likedByUsers: { select: { id: true } },
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
    return {
      ...bike,
      price: bike.price[0].price.toString(),
      likedByUsers: bike.likedByUsers.map((u) => u.id),
    };
  }

  async likeBike(bikeId: string, userId: string): Promise<BikeWithMeta> {
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
      include: BIKE_META_INCLUDE,
    });

    return {
      ...updatedBike,
      price: updatedBike.price[0].price.toString(),
      likedByUsers: updatedBike.likedByUsers.map((u) => u.id),
    };
  }

  async unlikeBike(bikeId: string, userId: string): Promise<BikeWithMeta> {
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
      include: BIKE_META_INCLUDE,
    });
    return {
      ...updatedBike,
      price: updatedBike.price[0].price.toString(),
      likedByUsers: updatedBike.likedByUsers.map((u) => u.id),
    };
  }

  async allLikedBikes(userId: string): Promise<BikeWithMeta[]> {
    const bikes = await this.db.bike.findMany({
      where: { likedByUsers: { some: { id: userId } } },
      include: BIKE_META_INCLUDE,
    });
    return bikes.map((b) => ({
      ...b,
      price: b.price[0].price.toString(),
      likedByUsers: b.likedByUsers.map((u) => u.id),
    }));
  }
}
