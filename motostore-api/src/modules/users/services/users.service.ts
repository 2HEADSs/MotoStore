import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';
import { CreateUserRequestBodyDto, UserResponseBodyDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private db: DatabaseService) { }


    async createUser(data: CreateUserRequestBodyDto): Promise<UserResponseBodyDto> {
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
            console.log("Created user:", user);
            return {
                id: user.id,
                email: user.email,
                userName: user.userName,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
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
                    userName: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users');
        }

    }
}
