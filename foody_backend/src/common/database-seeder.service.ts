import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RecipeStatus, RecipeType } from 'src/recipe/enums/recipe.enum';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
  ) {}

  async seed() {
    console.log('Starting database seeding...');

    // =======================  ADMIN ACCOUNTS =======================
    const adminsData = [
      { username: 'admin1', email: 'admin1@example.com', password: 'admin123' },
      { username: 'admin2', email: 'admin2@example.com', password: 'admin456' },
      { username: 'admin3', email: 'admin3@example.com', password: 'admin789' },
    ];

    for (const adminData of adminsData) {
      let admin = await this.adminRepository.findOne({ where: { email: adminData.email } });
      if (!admin) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt();
        admin = this.adminRepository.create({
          ...adminData,
          password: await bcrypt.hash(adminData.password, salt),
          role: UserRoleEnum.ADMIN,
          salt: salt,
        });
        await this.adminRepository.save(admin);
        console.log(` Admin ${admin.username} created`);
      }
    }

    // =======================  USER ACCOUNTS =======================
    const usersData = [
      { username: 'user1', email: 'user1@example.com', password: 'user123' },
      { username: 'user2', email: 'user2@example.com', password: 'user456' },
      { username: 'user3', email: 'user3@example.com', password: 'user789' },
    ];

    const users = [];

    for (const userData of usersData) {
      let user = await this.userRepository.findOne({ where: { email: userData.email } });
      if (!user) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt();
        user = this.userRepository.create({
          ...userData,
          password: await bcrypt.hash(userData.password, salt),
          role: UserRoleEnum.USER,
          salt: salt,
        });
        await this.userRepository.save(user);
        console.log(` User ${user.username} created`);
      }
      users.push(user);
    }

    // =======================  RECIPES =======================
    const recipesData = [
      {
        name: 'Salad Recipe',
        description: 'A fresh and healthy salad with tomatoes, cucumbers, and lettuce.',
        imgUrl: 'https://th.bing.com/th/id/OIP.jevUF8toFBsTCfqvRcuIRQHaLH?rs=1&pid=ImgDetMain',
        ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
        instructions: ['Chop lettuce', 'Chop tomato', 'Mix together'],
        category: RecipeType.LUNCH,
        status: RecipeStatus.VALIDATED,
        createdBy: users[0],
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'A classic Italian pasta dish with creamy sauce, eggs, and bacon.',
        imgUrl: 'https://th.bing.com/th/id/OIP.3MJODhMHPQg6v11AKki79QHaFj?rs=1&pid=ImgDetMain',
        ingredients: ['Spaghetti', 'Eggs', 'Bacon'],
        instructions: ['Cook spaghetti', 'Mix eggs and bacon', 'Combine and serve'],
        category: RecipeType.DINNER,
        status: RecipeStatus.VALIDATED,
        createdBy: users[1],
      },
      {
        name: 'Grilled Chicken',
        description: 'Juicy grilled chicken with a flavorful garlic herb marinade.',
        imgUrl: 'https://th.bing.com/th/id/OIP.Ow_TG1jIT5O2d7nMcXm_QwHaJQ?rs=1&pid=ImgDetMain',
        ingredients: ['Chicken', 'Garlic', 'Herbs'],
        instructions: ['Marinate chicken', 'Grill until cooked', 'Serve with herbs'],
        category: RecipeType.DINNER,
        status: RecipeStatus.VALIDATED,
        createdBy: users[2],
      },
    ];


    for (const recipeData of recipesData) {
      let recipe = await this.recipeRepository.findOne({ where: { name: recipeData.name } });
      if (!recipe) {
        recipe = this.recipeRepository.create(recipeData);
        await this.recipeRepository.save(recipe);
        console.log(` Recipe "${recipe.name}" created`);
      }
    }

    // =======================  COMMENTS =======================
    const commentsData = [
      { content: 'This recipe is amazing!', author: users[0] },
      { content: 'I loved this dish, very tasty.', author: users[1] },
      { content: 'The chicken was cooked perfectly!', author: users[2] },
    ];

    for (const commentData of commentsData) {
      let comment = await this.commentRepository.findOne({ where: { content: commentData.content } });
      if (!comment) {
        comment = this.commentRepository.create(commentData);
        await this.commentRepository.save(comment);
        console.log(` Comment "${comment.content}" created`);
      }
    }

    console.log('Database seeding completed successfully.');
  }
}
