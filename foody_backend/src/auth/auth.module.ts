import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';


dotenv.config();
@Module({
  imports: [
    UserModule, // Importe UserModule pour accéder à l'entité User
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.SECRET, //defin in .env SECRET
      signOptions: {
        expiresIn: 3600
      } }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
