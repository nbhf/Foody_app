import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidationMessages } from '../validation.messages';

export class CreateUserDto {
  
  @MinLength(3, { message: ValidationMessages.NAME_TOO_SHORT })
  @MaxLength(10, { message: ValidationMessages.NAME_TOO_LONG })
  @IsString({ message: ValidationMessages.STRING })
  @IsNotEmpty({ message: ValidationMessages.NAME_REQUIRED })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: ValidationMessages.STATUS_REQUIRED })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: ValidationMessages.PASSWORD_TOO_SHORT})
  password: string;
}