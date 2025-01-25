import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    UserModule, // Importe UserModule pour accéder à l'entité User

  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
