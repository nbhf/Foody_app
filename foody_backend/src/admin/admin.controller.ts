import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RecipeService } from 'src/recipe/recipe.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';


@Controller('admin')

export class AdminController {
  constructor(private readonly adminService: AdminService,
              private readonly recipeService: RecipeService
  ) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post('validate-recipe/:id')
  async validateRecipe(
  @Param('id') id: number, // Recipe ID
) {
  return this.adminService.validateRecipe(id);
}

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(UserRoleEnum.ADMIN)
  @Post('refuse-recipe/:id')
  async refuseRecipe(
    @Param('id') id: number,
  ) {
    return this.adminService.refuseRecipe(id);
  }
}

    
    
  
