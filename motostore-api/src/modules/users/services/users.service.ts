import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreateUserRequestBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async createUser(
    data: CreateUserRequestBodyDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.db.user.create({
        data: {
          email: data.email,
          userName: data.userName,
          phone: data.phone,
          hashedPassword: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          userName: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      // console.log("Created user:", user);
      return {
        id: user.id,
        email: user.email,
        userName: user.userName,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
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
  async getAllUsers(): Promise<Array<Omit<User, 'hashedPassword'>>> {
    try {
      return this.db.user.findMany({
        select: {
          id: true,
          email: true,
          userName: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    console.log(email, 'findUserByEmail');
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(user);
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });

    console.log(user);
    return user;
  }
}
