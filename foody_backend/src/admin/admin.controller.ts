import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RecipeService } from 'src/recipe/recipe.service';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
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
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }


  @Post('validate-recipe/:id')
  async validateRecipe(
    @Param('id') id: number,@Req()  req
  ) {
    const adminId = req.user.id; // Assuming the admin ID is available in the request
    return this.adminService.validateRecipe(id, adminId);
  }
}
