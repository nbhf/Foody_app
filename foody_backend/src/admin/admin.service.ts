import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { RecipeStatus } from 'src/recipe/enums/recipe.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = this.adminRepository.create(createAdminDto);
    return await this.adminRepository.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    return await this.adminRepository.findOneBy({ id });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    await this.adminRepository.update(id, updateAdminDto);
    return await this.adminRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.adminRepository.delete(id);
  }

  async validateRecipe(recipeId: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId }
    });
    
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
  
    recipe.status = RecipeStatus.VALIDATED;
    recipe.validatedAt = new Date();
  
    return await this.recipeRepository.save(recipe);
  }

  async refuseRecipe(recipeId: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId }
    });
    
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
  
    recipe.status = RecipeStatus.REFUSED;
    recipe.validatedAt = new Date();
    
  
    return await this.recipeRepository.save(recipe);
  }

  
}
