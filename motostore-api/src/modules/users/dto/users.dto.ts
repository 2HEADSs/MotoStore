import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUserRequestBodyDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 100)
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    userName: string;

    @IsNotEmpty()
    @Matches(/^\+\d{10,15}$/, {
        message: "Phone number must be in international format, e.g., +1234567890"
    })
    phone: string;
}



