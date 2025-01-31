import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';
import { Admin } from 'src/admin/entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


dotenv.config();
@Module({
  imports: [
    UserModule,   AdminModule,// Importe UserModule pour accéder à l'entité User
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET, //defin in .env SECRET
      signOptions: {
        expiresIn: 3600
      } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
