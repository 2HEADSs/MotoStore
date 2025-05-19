import { Module } from '@nestjs/common';
import { BikesService } from './services/bikes.service';
import { BikesController } from './controllers/bikes.controller';

@Module({
  providers: [BikesService],
  controllers: [BikesController]
})
export class BikesModule { }
