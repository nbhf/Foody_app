import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RecipeStatus } from 'src/recipe/enums/recipe.enum';
import { RecipeType } from 'src/recipe/enums/recipe.enum';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
  ) {}

  async seed() {
    // Générer un salt
    const salt = await bcrypt.genSalt(10);

    // Créer des admins
    const admin1 = this.adminRepository.create({
      username: 'admin1',
      email: 'admin1@example.com',
      password: await bcrypt.hash('admin123', salt),
      role: UserRoleEnum.ADMIN,
      salt: salt,
    });

    const admin2 = this.adminRepository.create({
      username: 'admin2',
      email: 'admin2@example.com',
      password: await bcrypt.hash('admin456', salt),
      role: UserRoleEnum.ADMIN,
      salt: salt,
    });

    const admin3 = this.adminRepository.create({
      username: 'admin3',
      email: 'admin3@example.com',
      password: await bcrypt.hash('admin789', salt),
      role: UserRoleEnum.ADMIN,
      salt: salt,
    });

    await this.adminRepository.save([admin1, admin2, admin3]);

    // Créer des utilisateurs
    const user1 = this.userRepository.create({
      username: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('user123', salt),
      role: UserRoleEnum.USER,
      salt: salt,
    });

    const user2 = this.userRepository.create({
      username: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('user456', salt),
      role: UserRoleEnum.USER,
      salt: salt,
    });

    const user3 = this.userRepository.create({
      username: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('user789', salt),
      role: UserRoleEnum.USER,
      salt: salt,
    });

    await this.userRepository.save([user1, user2, user3]);

    // Créer des recettes
    const recipe1 = this.recipeRepository.create({
      name: 'Salad Recipe',
      ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
      instructions: ['Chop lettuce', 'Chop tomato', 'Mix together'],
      category: RecipeType.LUNCH,
      status: RecipeStatus.ON_HOLD,
      createdBy: user1,
    });

    const recipe2 = this.recipeRepository.create({
      name: 'Spaghetti Carbonara',
      ingredients: ['Spaghetti', 'Eggs', 'Bacon'],
      instructions: ['Cook spaghetti', 'Mix eggs and bacon', 'Combine and serve'],
      category: RecipeType.DINNER,
      status: RecipeStatus.ON_HOLD,
      createdBy: user2,
    });

    const recipe3 = this.recipeRepository.create({
      name: 'Grilled Chicken',
      ingredients: ['Chicken', 'Garlic', 'Herbs'],
      instructions: ['Marinate chicken', 'Grill until cooked', 'Serve with herbs'],
      category: RecipeType.DINNER,
      status: RecipeStatus.ON_HOLD,
      createdBy: user3,
    });

    await this.recipeRepository.save([recipe1, recipe2, recipe3]);

    // Créer des commentaires
    const comment1 = this.commentRepository.create({
      content: 'This recipe is amazing!',
      author: user1,
    });

    const comment2 = this.commentRepository.create({
      content: 'I loved this dish, very tasty.',
      author: user2,
    });

    const comment3 = this.commentRepository.create({
      content: 'The chicken was cooked perfectly!',
      author: user3,
    });

    await this.commentRepository.save([comment1, comment2, comment3]);

    console.log('Seed data inserted successfully.');
  }
}
