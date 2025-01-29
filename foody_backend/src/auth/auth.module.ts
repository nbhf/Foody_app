import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    UserModule, // Importe UserModule pour accéder à l'entité User
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule

  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
