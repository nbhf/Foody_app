import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, QueryFailedError, Repository, Not } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { RecipeStatus } from 'src/recipe/enums/recipe.enum';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';

@Injectable()
export class AdminService {
  authService: any;
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private notificationService: NotificationService,
    private readonly UserService: UserService
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

  private async checkEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.adminRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<{admin: Admin; access_token?: any}> {
    const admin = await this.findOne(id);
    // Vérification et mise à jour de l'email
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      await this.checkEmailUniqueness(updateAdminDto.email);
      admin.email = updateAdminDto.email;
    }
  
    // Mise à jour du mot de passe avec hachage si fourni
    if (updateAdminDto.password) {
      //const bcrypt = require('bcryptjs');
      admin.salt = bcrypt.genSaltSync(); // ✅ genSaltSync remplace await bcrypt.genSalt()
      admin.password = await bcrypt.hash(updateAdminDto.password, admin.salt); // ✅ Correction ici
    }
    if(updateAdminDto.imgUrl){
      admin.imgUrl=updateAdminDto.imgUrl;
    }
  
    if (updateAdminDto.username && updateAdminDto.username !== admin.username) {
      const existingUser = await this.userRepository.findOne({ where: { username: updateAdminDto.username } });
      if (existingUser) {
        throw new ConflictException("Ce nom d'utilisateur est déjà utilisé.");
      }
      admin.username = updateAdminDto.username;
    }
    await this.userRepository.save(admin);
      if (updateAdminDto.username) {
        const newToken = await this.authService.generateToken(admin ,UserRoleEnum.USER);
        
      return {
        admin,
        access_token: newToken.access_token
      };
      }
      return {admin};
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

  private isAdmin(admin): boolean {
    return admin.role === UserRoleEnum.ADMIN
  }

  async softDeleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true, // Includes soft-deleted entities
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    await this.userRepository.softDelete(userId);
  }

  async restoreUser(userId: number): Promise<void> {
    const user = await this.userRepository.query( 'SELECT * FROM "user" WHERE id = $1',[userId] );

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  
    await this.userRepository.restore(userId);
  }
  
}
