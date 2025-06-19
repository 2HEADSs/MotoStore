import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { Bike } from '@prisma/client';

@Injectable()
export class AdminBikesService {
  constructor(private db: DatabaseService) {}

  async findAll(): Promise<Bike[]> {
    return this.db.bike.findMany();
  }
}