// src/modules/user/user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User , Recipe]),NotificationModule, forwardRef(() => AuthModule),], 
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService], 
})
export class UserModule {}
