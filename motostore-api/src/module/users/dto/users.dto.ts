import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserRequestBodyDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class UserResponseBodyDto {
    id: string;
    email: string;
}