import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RecipeService } from 'src/recipe/recipe.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';
import { Admin as AdminDecorator } from 'src/decorators/admin.decorator';
import { Admin } from './entities/admin.entity';


@Controller('admin')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService,
              private readonly userService: UserService,
              private readonly recipeService: RecipeService
  ) {}

 
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @AdminDecorator() admin: Admin
  ) {
    console.log("Utilisateur connecté :", admin);
    console.log("ID fourni dans l'URL :", id);
  
    // Vérification pour s'assurer que l'utilisateur ne met à jour que son propre profil
    if (admin.id !== id) {
      throw new Error("Vous ne pouvez modifier que votre propre compte.");
    }
    const result = await this.userService.update(id, updateAdminDto);
    return result; // Renvoie { admin, access_token }
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Post('validate-recipe/:id')
  async validateRecipe(
  @Param('id') id: number, // Recipe ID
) {
  return this.adminService.validateRecipe(id);
}


  @Post('refuse-recipe/:id')
  async refuseRecipe(
    @Param('id') id: number,
  ) {
    return this.adminService.refuseRecipe(id);
  }

  @Delete('softDelete/:id')
  async softDelete(
    @Param('id') id: number
  ) {
    return this.adminService.softDeleteUser(id);
  }

  @Put('restore/:id')
  async softRestore(
    @Param('id') userId: number
  )
  {return this.adminService.restoreUser(userId)}
}

    
    
  
