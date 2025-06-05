import { Module } from '@nestjs/common';
import { BikesService } from './services/bikes.service';
import { BikesController } from './controllers/bikes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BikesService],
  controllers: [BikesController],
})
export class BikesModule {}
