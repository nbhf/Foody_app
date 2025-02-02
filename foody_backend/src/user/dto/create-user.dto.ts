import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ERROR_MESSAGES } from 'src/common/error_message';

export class CreateUserDto {
  
  @MinLength(3, { message: ERROR_MESSAGES.USER.NAME_TOO_SHORT })
  @MaxLength(10, { message: ERROR_MESSAGES.USER.NAME_TOO_LONG })
  @IsString({ message:ERROR_MESSAGES.USER.STRING })
  @IsNotEmpty({ message: ERROR_MESSAGES.USER.NAME_REQUIRED })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: ERROR_MESSAGES.USER.STATUS_REQUIRED })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message:ERROR_MESSAGES.USER.PASSWORD_TOO_SHORT})
  password: string;
}