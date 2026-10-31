import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {
    @ApiProperty({
        description: 'email address used to register the user',
        nullable: false,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'user password',
        nullable: false,
        minLength: 6,
        maxLength: 60
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}