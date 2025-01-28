import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [
    TypeOrmModule.forFeature([Recipe])
  ]
})
export class RecipeModule {}
