import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [UserModule,
    TypeOrmModule.forFeature([Recipe]),
  ],
  exports: [RecipeService]
})
export class RecipeModule {}
