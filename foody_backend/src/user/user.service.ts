import { Injectable, NotFoundException, ConflictException ,ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './enums/user-role.enum';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { NotificationService } from 'src/notification/notification.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {}

  
/// Met à jour un utilisateur existant avec validation
async update(id: number, updateUserDto: UpdateUserDto): Promise<{ user: User; access_token?: any }> {
  const user = await this.findOne(id);

  // Vérification et mise à jour de l'email
  if (updateUserDto.email && updateUserDto.email !== user.email) {
    await this.checkEmailUniqueness(updateUserDto.email);
    user.email = updateUserDto.email;
  }

  // Mise à jour du mot de passe avec hachage si fourni
  if (updateUserDto.password) {
    //const bcrypt = require('bcryptjs');
    user.salt = bcrypt.genSaltSync(); // ✅ genSaltSync remplace await bcrypt.genSalt()
    user.password = await bcrypt.hash(updateUserDto.password, user.salt); // ✅ Correction ici
  }

  if (updateUserDto.username && updateUserDto.username !== user.username) {
    const existingUser = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
    if (existingUser) {
      throw new ConflictException("Ce nom d'utilisateur est déjà utilisé.");
    }
    user.username = updateUserDto.username;
  }
  await this.userRepository.save(user);
    if (updateUserDto.username) {
     const newToken = await this.authService.generateToken(user ,UserRoleEnum.USER);
     
    return {
      user,
      access_token: newToken.access_token
    };
    }
    return {user};
  }


  // Récupère un utilisateur par son ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'imgUrl'],
    });

    if (!user) throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable.`);
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id','username', 'email'],
    });
    return users;
  }

  // Supprime un utilisateur par ID
  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

 // Vérifie si un email est unique
  private async checkEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
  }

  isOwnerOrAdmin(objet, user) {
    return user.role === UserRoleEnum.ADMIN || (objet.createdBy && objet.createdBy.id === user.id);
  }
  isAdmin (user){
    return user.role === UserRoleEnum.ADMIN
  }


   //sauvegarder une recette 
  async saveRecipe(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['savedRecipes'] });
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });

    if (!user || !recipe) {
      throw new Error('User or Recipe not found');
    }

    user.savedRecipes.push(recipe);
    await this.notificationService.createUserNotification(`You saved ${recipe.name}`,userId);
    return this.userRepository.save(user);
  }


   // Récupérer les recettes sauvegardées par un utilisateur donné
   async getSavedRecipes(userId: number): Promise<Recipe[]>{
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['savedRecipes'], // Charger la relation "savedRecipes"
    });
    if(!user){
      throw new Error('Utilisateur non trouvé');
    }
    return  user.savedRecipes ;
  }



}
