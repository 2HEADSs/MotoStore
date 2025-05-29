import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { BikesModule } from './modules/bikes/bikes.module';

@Module({
  imports: [DatabaseModule, UsersModule, BikesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
