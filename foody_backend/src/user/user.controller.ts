import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards ,Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';// Garde d'authentification
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

// Route pour sauvegarder une recette
@Post(':userId/save-recipe/:recipeId')
  // @UseGuards(JwtAuthGuard)  // Assurez-vous que l'utilisateur est authentifié
  saveRecipe(@Param('userId') userId: number, @Param('recipeId') recipeId: number): Promise<any> {
  // Obtention de l'utilisateur connecté via le JWT
    return this.userService.saveRecipe(userId, recipeId);
  }

// Endpoint pour récupérer les recettes sauvegardées par un utilisateur
@Get(':userId/saved-recipes')
async getSavedRecipes(@Param('userId') userId: number) {
  const savedRecipes = await this.userService.getSavedRecipes(userId);
  return savedRecipes;
}

}