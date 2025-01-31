import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Recipe } from './entities/recipe.entity';


@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeDto: CreateRecipeDto,  @User() user) {
    return this.recipeService.create(createRecipeDto,user);
  }

  @Get('validated')
  async getValidatedRecipes(): Promise<Recipe[]> {
    return this.recipeService.findValidated();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user) {
    return this.recipeService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @User() user) {
    return this.recipeService.update(+id, updateRecipeDto,user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user) {
    return this.recipeService.remove(+id,user);
  }
}
