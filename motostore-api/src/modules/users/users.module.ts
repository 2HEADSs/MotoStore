import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DatabaseModule } from 'src/modules/database/database.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [DatabaseModule]
})
export class UsersModule {}
