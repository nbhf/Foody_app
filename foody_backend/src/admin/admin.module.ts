import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([Admin,Recipe,User]),
    ConfigModule.forRoot({isGlobal: true,}),
  ]
})
export class AdminModule {}
