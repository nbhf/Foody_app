import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const newRecipe = this.recipeRepository.create(createRecipeDto);
    newRecipe.validatedBy = null;
    newRecipe.isValidated = false;
    return await this.recipeRepository.save(newRecipe);
  }

  async findAll(): Promise<Recipe[]> {
    return await this.recipeRepository.find();
  }

  async findOne(id: number): Promise<Recipe> {
    return await this.recipeRepository.findOneBy({ id });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    await this.recipeRepository.update(id, updateRecipeDto);
    return await this.recipeRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }

  async getUnvalidatedRecipes(): Promise<Recipe[]> {
    return await this.recipeRepository.find({
      where: { validatedBy: IsNull() }
    });
  }
  
}
