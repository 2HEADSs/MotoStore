import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminUsersService } from './services/admin-users.service';
import { BikesModule } from '../bikes/bikes.module';

@Module({
  providers: [UsersService, AdminUsersService],
  controllers: [UsersController, AdminUsersController],
  imports: [DatabaseModule, forwardRef(() => AuthModule), BikesModule],
  exports: [UsersService],
})
export class UsersModule {}
