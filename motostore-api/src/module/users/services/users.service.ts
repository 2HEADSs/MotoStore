import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/module/database/database.service';
import { CreateUserRequestBodyDto, UserResponseBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private db: DatabaseService) { }


    async createUser(data: CreateUserRequestBodyDto): Promise<UserResponseBodyDto> {
        try {

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.db.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                },
            });
            console.log("Created user:", user);
            return {
                id: user.id,
                email: user.email
            };
        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new ConflictException('Email already exists');
            }

            throw new InternalServerErrorException('Something went wrong while creating user');
        }
    }
    async getAllUsers(): Promise<UserResponseBodyDto[]> {
        try {

            return this.db.user.findMany({
                select: {
                    id: true,
                    email: true,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users');
        }

    }
}
