import { Bike } from '@prisma/client';

export type BikeWithMeta = Bike & {
  price: string;
  likedByUsers: string[];
};
