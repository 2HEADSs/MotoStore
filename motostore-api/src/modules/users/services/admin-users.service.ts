import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
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
      console.log(where);

      return await this.db.user.findMany({ where });
    } catch (error) {
      console.error('Error fetching users in admin service:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
