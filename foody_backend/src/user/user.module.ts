// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Enregistre l'entité avec TypeORM
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService], // Exporte l'entité pour que d'autres modules puissent l'utiliser
})
export class UserModule {}
