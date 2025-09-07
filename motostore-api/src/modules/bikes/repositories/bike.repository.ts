import { Bike, Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/modules/database/database.service';

type LatestPrice = {
  price: number;
  createdAt: Date;
};

export class BikeRepository {
  constructor(private readonly prisma: DatabaseService) {}
  async findByIdWithLatestPrice(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<Bike | null> {
    const bike = await tx.bike.findUnique({
      where: { id },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true },
        },
      },
    });
    if (!bike) return null;
    return bike;
  }
}
