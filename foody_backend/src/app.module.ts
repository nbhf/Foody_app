import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { RecipeModule } from './recipe/recipe.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/entities/admin.entity';

// variables de configuration
import * as dotenv from 'dotenv';
import { User } from './user/entities/user.entity';
import { Recipe } from './recipe/entities/recipe.entity';
import { Comment } from './comment/entities/comment.entity';

import appConfig from './config/app.config';
import { CommentModule } from './comment/comment.module';
import { DatabaseSeederService } from './common/database-seeder.service';
dotenv.config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password:  process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),

    AuthModule, UserModule, AdminModule, RecipeModule, CommonModule, ConfigModule,CommentModule],
    
  controllers: [AppController],
  providers: [AppService,DatabaseSeederService],
})
export class AppModule {}
