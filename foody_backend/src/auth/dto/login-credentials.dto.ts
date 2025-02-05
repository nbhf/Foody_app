import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginCredentialsDto {

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  imgUrl:string;
}