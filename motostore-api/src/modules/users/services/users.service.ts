import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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
  // private readonly logger = new Logger(UsersService.name);
  constructor(private db: DatabaseService) {}

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
      console.log(error, 'error users.service.ts -create user');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating user',
      );
    }
  }
  async getAllUsers(): Promise<SafeUser[]> {
    try {
      return this.db.user.findMany({
        select: userSelectFields,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.db.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${id} not found`);
      }
      return user;
    } catch (error) {}
    throw new InternalServerErrorException('Failed to validate user');
  }
}
