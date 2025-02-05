import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayloadInterface } from '../interfaces/payload.interface';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';

dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository : Repository<Admin>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: PayloadInterface) {
    //console.log('Payload:', payload);
  
    // Check User Repository
    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    });
  
    if (user) {
      delete user.salt;
      delete user.password;
      return { ...user, role: 'user' }; 
    }
  
    // Check Admin Repository if User not found
    const admin = await this.adminRepository.findOne({
      where: { username: payload.username },
    });
  
    if (admin) {
      delete admin.salt;
      delete admin.password;
      return { ...admin, role: 'admin' }; 
    }
  
    throw new UnauthorizedException('Invalid credentials');
  }
  
}