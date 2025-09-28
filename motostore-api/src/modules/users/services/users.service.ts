import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import { ListingStatus } from '@prisma/client';
import { BikesService } from 'src/modules/bikes/services/bikes.service';
import { BikeWithMeta } from 'src/modules/bikes/types/bikes-with-meta.type';
import { AuthUser } from '../types/authUser.type';
import { SafeUser } from '../types/safeUser.type';
import { UserStatus } from '../types/userStatus';

export const userSelectFields = {
  id: true,
  email: true,
  username: true,
  isBlocked: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

const authUserSelect = {
  id: true,
  email: true,
  username: true,
  phone: true,
  role: true,
  isBlocked: true,
  createdAt: true,
  updatedAt: true,
  hashedPassword: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private db: DatabaseService,
    private readonly bikesService: BikesService,
  ) {}

  async createUser(data: CreateUserRequestBodyDto): Promise<SafeUser> {
    try {
      const hashedPassword = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS || '10'),
      );
      const user = await this.db.user.create({
        data: {
          email: data.email,
          username: data.username,
          phone: data.phone,
          hashedPassword,
          role: 'USER',
        },
        select: userSelectFields,
      });
      return user;
    } catch (error) {
      // console.log(error, 'error users.service.ts -create user');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating user',
      );
    }
  }

  async getUserByEmail(email: string): Promise<SafeUser> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: userSelectFields,
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getUserForAuth(email: string): Promise<AuthUser> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: authUserSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async getLikedBikes(userId: string): Promise<BikeWithMeta[]> {
    return this.bikesService.allLikedBikes(userId);
  }

  async getCreatedBikes(
    userId: string,
    status?: ListingStatus,
  ): Promise<BikeWithMeta[]> {
    return this.bikesService.findMyBikes(userId, status);
  }

  async getUserStatusById(id: string): Promise<UserStatus | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: { id: true, isBlocked: true },
    });
    return user;
  }
}
