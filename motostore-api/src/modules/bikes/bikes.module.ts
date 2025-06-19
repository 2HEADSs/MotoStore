import { Module } from '@nestjs/common';
import { BikesService } from './services/bikes.service';
import { BikesController } from './controllers/bikes.controller';
import { DatabaseModule } from '../database/database.module';
import { AdminBikesService } from './services/admin-bikes.service';
import { AdminBikesController } from './controllers/admin-bikes.controller';

@Module({
  imports: [DatabaseModule],
  providers: [BikesService, AdminBikesService],
  controllers: [BikesController, AdminBikesController],
})
export class BikesModule {}
