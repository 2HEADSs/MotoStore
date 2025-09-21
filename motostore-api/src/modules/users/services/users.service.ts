import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import { ListingStatus, User } from '@prisma/client';
import { BikesService } from 'src/modules/bikes/services/bikes.service';
import { BikeWithMeta } from 'src/modules/bikes/types/bikes-with-meta.type';

type SafeUser = Omit<User, 'hashedPassword'>;

const userSelectFields = {
  id: true,
  email: true,
  username: true,
  isBlocked: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

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

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.db.user.findUnique({
      where: { email },
      // select: userSelectFields,
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
}
