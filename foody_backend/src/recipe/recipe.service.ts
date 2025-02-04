import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeStatus } from './enums/recipe.enum';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, user): Promise<Recipe> {
    try {
      console.log("first recipe:",createRecipeDto);

      const newRecipe = this.recipeRepository.create(createRecipeDto);
      console.log("nex recipe:",newRecipe);
      // newRecipe.status = RecipeStatus.ON_HOLD;
      newRecipe.createdBy = user;

      const userId= user.id;
      await this.notificationService.createNotificationForAllAdmins('A new recipe has been submitted!');
      await this.notificationService.createUserNotification('Your recipe has been submitted!', userId);


      return await this.recipeRepository.save(newRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error.message);
      throw new InternalServerErrorException('Failed to create recipe');
    }
  }

  async findByStatus(status: RecipeStatus): Promise<Recipe[]> {
    try {
      const recipes = await this.recipeRepository.find({
        where: { status }, 
        relations: ['createdBy'], 
      });
  
      if (recipes.length === 0) {
        throw new NotFoundException(`Aucune recette trouvée avec le statut ${status}`);
      }
      
      return recipes;
      
    } catch (error) {
      console.error(`Error fetching recipes with status ${status}:`, error.message);
      throw error;
    }
  }
  

  async findAll(user): Promise<Recipe[]> {
    try { 
        if (this.userService.isAdmin(user)) {
          return await this.recipeRepository.find({ relations: ['createdBy']});
        } else {
          throw new UnauthorizedException('Access denied');
        }
  
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      throw error;
    }
  }

  async findOne(id: number): Promise<Recipe> {
    try {
      const recipe = await this.recipeRepository.findOne({where: {id},relations:['createdBy']});
      if (!recipe) {
        throw new NotFoundException(`Recipe with ID ${id} not found`);
      }
      return recipe;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error.message);
      throw error;
    }
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, user): Promise<Recipe> {
    try {
      const recipe = await this.findOne(id);
      if (!this.userService.isOwnerOrAdmin(recipe, user)) {
        throw new UnauthorizedException('You do not have permission to update this recipe');
      }

      await this.recipeRepository.update(id, updateRecipeDto);
      return await this.findOne(id);
    } catch (error) {
      console.error(`Error updating recipe with ID ${id}:`, error.message);
      throw error;
    }
  }

  async remove(id: number, user): Promise<void> {
    try {
      const recipe = await this.recipeRepository.findOne({where: {id},relations:['createdBy']});
      if (!this.userService.isOwnerOrAdmin(recipe, user)) {
        throw new UnauthorizedException('You do not have permission to delete this recipe');
      }

      await this.recipeRepository.delete(id);
      console.log("recipe deleted successfully !!");
    } catch (error) {
      console.error(`Error deleting recipe with ID ${id}:`, error.message);
      throw error;
    }
  }
}
