import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RecipeService } from 'src/recipe/recipe.service';
import { RecipeModule } from 'src/recipe/recipe.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService,
              RecipeService
  ],
  imports: [
    TypeOrmModule.forFeature([Admin,Recipe,User]),
    ConfigModule.forRoot({isGlobal: true,}),
    RecipeModule,
    UserModule
  ],
  exports: [
    TypeOrmModule
  ]
})
export class AdminModule {}
