import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/admin/entities/admin.entity';
import { User } from 'src/user/entities/user.entity';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RecipeStatus, RecipeType } from 'src/recipe/enums/recipe.enum';

@Injectable()
export class DatabaseSeederService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
  ) {}

  async seed() {
    console.log('🚀 Starting database seeding...');

    // =======================  ADMIN ACCOUNTS =======================
    const adminsData = [
      { username: 'admin1', email: 'admin1@example.com', password: 'admin123' },
      { username: 'admin2', email: 'admin2@example.com', password: 'admin456' },
      { username: 'admin3', email: 'admin3@example.com', password: 'admin789' },
      { username: 'admin4', email: 'admin4@example.com', password: 'admin101' },
      { username: 'admin5', email: 'admin5@example.com', password: 'admin202' },
      { username: 'admin6', email: 'admin6@example.com', password: 'admin303' },
    ];

    for (const adminData of adminsData) {
      const existingAdmin = await this.dataSource
        .createQueryBuilder()
        .select('admin')
        .from(Admin, 'admin')
        .where('admin.email = :email', { email: adminData.email })
        .getOne();

      if (!existingAdmin) {
        const salt = await bcrypt.genSalt();
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Admin)
          .values({
            ...adminData,
            password: await bcrypt.hash(adminData.password, salt),
            role: UserRoleEnum.ADMIN,
            salt: salt,
          })
          .execute();
        console.log(`✅ Admin ${adminData.username} created`);
      }
    }

    // =======================  USER ACCOUNTS =======================
    const usersData = [
      { username: 'user1', email: 'user1@example.com', password: 'user123' },
      { username: 'user2', email: 'user2@example.com', password: 'user456' },
      { username: 'user3', email: 'user3@example.com', password: 'user789' },
      { username: 'user4', email: 'user4@example.com', password: 'user101' },
      { username: 'user5', email: 'user5@example.com', password: 'user202' },
      { username: 'user6', email: 'user6@example.com', password: 'user303' },
    ];

    const users = [];

    for (const userData of usersData) {
      const existingUser = await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.email = :email', { email: userData.email })
        .getOne();

      if (!existingUser) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            ...userData,
            password: hashedPassword,
            role: UserRoleEnum.USER,
            salt: salt,
          })
          .execute();
        console.log(`✅ User ${userData.username} created`);
      }
      users.push(existingUser || userData);
    }

    // =======================  RECIPES =======================
    const recipesData = [
      { name: 'Salad', description: 'Fresh veggies.', imgUrl: 'https://th.bing.com/th/id/R.fd5f2e7ca8c08537b31153d7722d3dfa?rik=b5wwZAxRuBxU6g&pid=ImgRaw&r=0', ingredients: ['Lettuce', 'Tomato'], instructions: ['Chop', 'Mix'], category: RecipeType.LUNCH, status: RecipeStatus.VALIDATED, createdBy: users[0] },
      { name: 'Pasta', description: 'Italian style.', imgUrl: 'https://i.pinimg.com/originals/0c/ce/03/0cce0327c68c480fff9fd58c1b5b48ff.jpg', ingredients: ['Pasta', 'Sauce'], instructions: ['Boil', 'Serve'], category: RecipeType.DINNER, status: RecipeStatus.VALIDATED, createdBy: users[1] },
      { name: 'Soup', description: 'Hot and fresh.', imgUrl: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-recipe.jpg', ingredients: ['Water', 'Veggies'], instructions: ['Boil', 'Simmer'], category: RecipeType.DINNER, status: RecipeStatus.VALIDATED, createdBy: users[2] },
      { name: 'Burger', description: 'Juicy beef.', imgUrl: 'https://th.bing.com/th/id/OIP.sVvjZiDL2RKdLoRmv_gAcAHaEK?rs=1&pid=ImgDetMain', ingredients: ['Beef', 'Bun'], instructions: ['Grill', 'Assemble'], category: RecipeType.LUNCH, status: RecipeStatus.VALIDATED, createdBy: users[3] },
      { name: 'Pizza', description: 'Cheesy goodness.', imgUrl: 'https://th.bing.com/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?rs=1&pid=ImgDetMain', ingredients: ['Dough', 'Cheese'], instructions: ['Bake', 'Serve'], category: RecipeType.DINNER, status: RecipeStatus.VALIDATED, createdBy: users[4] },
      { name: 'Omelette', description: 'Egg-based.', imgUrl: 'https://www.wholesomeyum.com/wp-content/uploads/2020/07/wholesomeyum-Omelette-Recipe-9.jpg', ingredients: ['Eggs', 'Salt'], instructions: ['Beat', 'Cook'], category: RecipeType.BREAKFAST, status: RecipeStatus.VALIDATED, createdBy: users[5] },
    ];

    for (const recipeData of recipesData) {
      const existingRecipe = await this.dataSource
        .createQueryBuilder()
        .select('recipe')
        .from(Recipe, 'recipe')
        .where('recipe.name = :name', { name: recipeData.name })
        .getOne();

      if (!existingRecipe) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Recipe)
          .values(recipeData)
          .execute();
        console.log(`✅ Recipe "${recipeData.name}" created`);
      }
    }

    // =======================  COMMENTS =======================
    const commentsData = [
      { content: 'Delicious!', author: usersData[0], recipe: recipesData[0] },
      { content: 'So tasty.', author: users[1], recipe: recipesData['Salad'] },
      { content: 'Yummy!', author: users[2], recipe: recipesData[2] },
      { content: 'Great recipe.', author: users[3], recipe: recipesData[3] },
      { content: 'Loved it!', author: users[4], recipe: recipesData[4] },
      { content: 'Perfect!', author: users[5], recipe: recipesData[5] },
    ];
    
    for (const commentData of commentsData) {
      const existingComment = await this.dataSource
        .createQueryBuilder()
        .select('comment')
        .from(Comment, 'comment')
        .where('comment.content = :content', { content: commentData.content })
        .getOne();
    
      if (!existingComment) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Comment)
          .values({
            content: commentData.content,
            author: commentData.author,
            recipe: commentData.recipe,
          })
          .execute();
        console.log(`✅ Comment "${commentData.content}" created`);
      }
    }
    

    console.log('🎉 Database seeding completed successfully.');
  }
}
