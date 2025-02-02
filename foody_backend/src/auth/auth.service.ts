import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserSubscribeDto } from './dto/signup-credentials.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { Admin } from 'src/admin/entities/admin.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>
      ) {
      }

    async register(userData: UserSubscribeDto): Promise<Partial<User>> {
        const user = this.userRepository.create({
          ...userData
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try {
          await this.userRepository.save(user);
        } catch (e) {
          console.error(" Erreur détectée :", e); //pour voir l'erreur exacte
  
          if (e instanceof QueryFailedError && e.message.includes("Duplicate")) {
              throw new ConflictException(`Le username ou l'email est déjà utilisé`);
          }
          
          throw new Error(`Erreur technique: ${e.message}`); // le vrai message d'erreur
      }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          };
    
      }

      async login(credentials: LoginCredentialsDto) {
        const { username, password } = credentials;
      
        // Check if it's a user
        const user = await this.userRepository.createQueryBuilder("user")
          .where("user.username = :username or user.email = :username", { username })
          .getOne();
      
        // Check if it's an admin
        const admin = await this.adminRepository.createQueryBuilder("admin")
          .where("admin.username = :username or admin.email = :username", { username })
          .getOne();
      
        if (!user && !admin) {
          throw new NotFoundException('Username or password is incorrect');
        }
      
        if (user) {
          // User login logic
          const isUserPasswordValid = await this.verifyUserPassword(user, password);
          if (!isUserPasswordValid) {
            throw new UnauthorizedException('Invalid user credentials');
          }
          return this.generateToken(user, UserRoleEnum.USER);
        } else if (admin) {
          // Admin login logic
          const isAdminPasswordValid = await this.verifyAdminPassword(admin, password);
          if (!isAdminPasswordValid) {
            throw new UnauthorizedException('Invalid admin credentials');
          }
          return this.generateToken(admin, UserRoleEnum.ADMIN);
        }
      }
      
      private async verifyUserPassword(user: User, password: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, user.salt);
        return hashedPassword === user.password;
      }
      
      private async verifyAdminPassword(admin: Admin, password: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, admin.salt);
        return hashedPassword === admin.password;
      }
      
      private async generateToken(entity: User | Admin, role: UserRoleEnum.USER| UserRoleEnum.ADMIN) {
        const payload = {
          id: entity.id,
          username: entity.username,
          role: role
        };
        const jwt = await this.jwtService.sign(payload);
        return {
          "access_token": jwt
        };
      }
      
}
