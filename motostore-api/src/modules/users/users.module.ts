import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersController } from './controllers/admin-users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController, AdminUsersController],
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
