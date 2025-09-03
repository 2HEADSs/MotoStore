import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Bike, Role, User } from '@prisma/client';
import { DatabaseService } from 'src/modules/database/database.service';
import { UserFilterDto } from '../dto/users.dto';

@Injectable()
export class AdminUsersService {
  constructor(private db: DatabaseService) {}

  async findAll(filter?: UserFilterDto): Promise<User[]> {
    try {
      const where: { role?: Role; isBlocked?: boolean } = {};

      if (filter?.role) {
        where.role = filter.role as Role;
      }

      if (filter?.isBlocked !== undefined) {
        where.isBlocked = filter.isBlocked;
      }
      // console.log(where);

      return await this.db.user.findMany({ where });
    } catch (error) {
      console.error('Error fetching users in admin service:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async changeUserStatus(id: string, isBlocked: boolean): Promise<User> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    try {
      return await this.db.user.update({
        where: { id },
        data: { isBlocked },
      });
    } catch (error) {
      console.error('Error changing user status in admin service:', error);
      throw new InternalServerErrorException('Failed to change user status');
    }
  }

  async userLikedBikes(userId: string): Promise<Bike[]> {
    try {
      const bikes = await this.db.bike.findMany({
        where: { likedByUsers: { some: { id: userId } } },
      });
      return bikes;
    } catch (error) {
      console.error('Error fetching user liked bikes in admin service:', error);
      throw new InternalServerErrorException(
        'Failed to fetch user liked bikes',
      );
    }
  }
}
