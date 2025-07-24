import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Bike, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * TODO: tx?
   * @param id  bikeID
   * @param tx  optional PrismaClient
   */
  async getBikeWithLatestPrice(
    id: string,
    tx: PrismaClient = this,
  ): Promise<(Bike & { price: { price: number; createdAt: Date }[] }) | null> {
    const bike = await tx.bike.findUnique({
      where: { id },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true, createdAt: true },
        },
      },
    });

    if (!bike) return null;
    console.log(bike + "database.services.ts");
    return {
      ...bike,
      price: bike.price.map((p) => ({
        ...p,
        price: (p.price as Decimal).toNumber(),
      })),
    } as Bike & { price: { price: number; createdAt: Date }[] };
  }
}
