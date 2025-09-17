import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from 'src/modules/database/database.service';
import { BikeWithMeta } from '../types/bikes-with-meta.type';

export class BikeRepository {
  constructor(private readonly prisma: DatabaseService) {}
  async findByIdWithLatestPrice(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<BikeWithMeta | null> {
    const bike = await tx.bike.findUnique({
      where: { id },
      include: {
        price: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { price: true },
        },
        likedByUsers: { select: { id: true } },
      },
    });
    if (!bike) return null;

    return {
      ...bike,
      price: bike.price[0].price.toString(),
      likedByUsers: bike.likedByUsers.map((u) => u.id),
    };
  }
}
