import { Injectable } from '@nestjs/common';
import { CreateBikeRequestBodyDto } from '../dto/bikes.dto';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class BikesService {
  constructor(private db: DatabaseService) {}

  async createBike(
    userId: string,
    data: CreateBikeRequestBodyDto,
  ): Promise<any> {
    return this.db.bike.create({
      data: {
        ownerId: userId,
        ...data,
      },
    });
  }
}
