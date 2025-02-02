import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { RecipeStatus } from 'src/recipe/enums/recipe.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    //@InjectRepository(User) private repository: Repository<User>
    private notificationService: NotificationService,
  ) {}


  async create(createAdminDto: CreateAdminDto): Promise<Partial<Admin>> {
    const admin = this.adminRepository.create({
      ...createAdminDto
    });
    admin.salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(admin.password, admin.salt);
     try {
              await this.adminRepository.save(admin);
            } catch (e) {
              console.error(" Erreur détectée :", e); //pour voir l'erreur exacte
      
              if (e instanceof QueryFailedError && e.message.includes("Duplicate")) {
                  throw new ConflictException(`Le username ou l'email est déjà utilisé`);
              }
              
              throw new Error(`Erreur technique: ${e.message}`); // le vrai message d'erreur
          }
    return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      };

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
      where: { id: recipeId } , relations: ['createdBy']
    });
    
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
  
    recipe.status = RecipeStatus.VALIDATED;
    recipe.validatedAt = new Date();

    const userId = recipe.createdBy.id;
    await this.notificationService.createUserNotification(`Your recipe ${recipe.name} has been approved.`, userId);
  
    return await this.recipeRepository.save(recipe);
  }

  async refuseRecipe(recipeId: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId }, relations: ['createdBy']
    });
    
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
  
    recipe.status = RecipeStatus.REFUSED;
    recipe.validatedAt = new Date();

    const userId = recipe.createdBy.id;
    await this.notificationService.createUserNotification(`Your recipe ${recipe.name} has been refused.`, userId);
    
    return await this.recipeRepository.save(recipe);
  }

  
}
