import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';

@Injectable()
export class AdminBikesService {
  constructor(private db: DatabaseService) {}

  async findAll(): Promise<Bike[]> {
    try {
      return await this.db.bike.findMany();
    } catch (error) {
      console.error('Error fetching bikes in admin service:', error);
      throw new InternalServerErrorException('Failed to fetch bikes');
    }
  }
}
