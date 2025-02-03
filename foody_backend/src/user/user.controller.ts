import { Controller, Get, Patch, Delete, Param, Body, UseGuards, ParseIntPipe, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import { UserRoleEnum } from './enums/user-role.enum';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')

  async getProfile(@UserDecorator() user: User) {
    console.log(user.id);
    return this.userService.findOne(user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() user: User
  ) {
    console.log("Utilisateur connecté :", user);
    console.log("ID fourni dans l'URL :", id);
  
    // Vérification pour s'assurer que l'utilisateur ne met à jour que son propre profil
    if (user.id !== id) {
      throw new Error("Vous ne pouvez modifier que votre propre compte.");
    }
  
    // Mise à jour de l'utilisateur
    return this.userService.update(id, updateUserDto);
  }
  

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER) 
  async delete(@Param('id', ParseIntPipe) id: number, @UserDecorator() user: User) {
    if (user.role === UserRoleEnum.USER) {
      console.log("Utilisateur connecté :", user);
      console.log("ID fourni dans l'URL :", id);
      if (user.id !== id) {
        throw new ForbiddenException("Vous ne pouvez supprimer que votre propre compte.");
      }
    }

    const userToDelete = await this.userService.findOne(id);
    if (!userToDelete) {
      throw new NotFoundException("L'utilisateur à supprimer n'existe pas.");
    }

    return this.userService.delete(id);
  }
}
