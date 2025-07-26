import { Module } from '@nestjs/common';
import { BikesService } from './services/bikes.service';
import { BikesController } from './controllers/bikes.controller';
import { DatabaseModule } from '../database/database.module';
import { AdminBikesService } from './services/admin-bikes.service';
import { AdminBikesController } from './controllers/admin-bikes.controller';
import { BikeRepository } from './repositories/bike.repository';

@Module({
  imports: [DatabaseModule],
  providers: [BikesService, AdminBikesService, BikeRepository],
  controllers: [BikesController, AdminBikesController],
})
export class BikesModule {}
