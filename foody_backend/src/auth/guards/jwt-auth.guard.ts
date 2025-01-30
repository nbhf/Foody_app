import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Authentication failed. You must be logged in to access this resource.');
    }
    return user; 
  }
}
