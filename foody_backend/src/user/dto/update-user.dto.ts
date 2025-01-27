import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  email?: string;
}
