import { Bike, Prisma, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/modules/database/database.service';

type LatestPrice = {
  price: number;
  createdAt: Date;
};
export type BikeWithLatestPrice = Bike & { price: LatestPrice[] };

export class BikeRepository {
  constructor(private readonly prisma: DatabaseService) {}
  async findByIdWithLatestPrice(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<BikeWithLatestPrice | null> {
    const bike = await tx.bike.findUnique({
      where: { id },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!bike) return null;
    return {
      ...bike,
      price: bike.price.map((p) => ({
        ...p,
        price: (p.price as Decimal).toNumber(),
      })),
    } as BikeWithLatestPrice;
  }
}
