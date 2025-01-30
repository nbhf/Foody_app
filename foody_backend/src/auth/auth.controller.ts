import { Body, Controller, Post } from '@nestjs/common';
import { UserSubscribeDto } from './dto/signup-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

    @Post('signup')
    register(
      @Body() userData: UserSubscribeDto
    ) {
      return this.authService.register(userData);
    }
  
    @Post('login')
    login(
      @Body() credentials: LoginCredentialsDto
    ) {
      return this.authService.login(credentials);
    }
}
