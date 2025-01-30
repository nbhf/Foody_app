import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeStatus } from './enums/recipe.enum';
import { UserService } from 'src/user/user.service';


@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private userService: UserService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, user): Promise<Recipe> {
    const newRecipe = this.recipeRepository.create(createRecipeDto);
    newRecipe.status = RecipeStatus.ON_HOLD;
    newRecipe.createdBy= user;
    return await this.recipeRepository.save(newRecipe);
  }

  async findAll(): Promise<Recipe[]> {
    return await this.recipeRepository.find();
  }

  async findOne(id: number): Promise<Recipe> {
    return await this.recipeRepository.findOneBy({ id });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, user): Promise<Recipe> {
    if (this.userService.isOwnerOrAdmin(updateRecipeDto,user))
      {await this.recipeRepository.update(id, updateRecipeDto);
      return await this.recipeRepository.findOneBy({ id });}
    else
      new UnauthorizedException('');
  }

  async remove(id: number, user): Promise<void> {
    if (this.userService.isOwnerOrAdmin(id,user))
      await this.recipeRepository.delete(id);
  }
  
}
