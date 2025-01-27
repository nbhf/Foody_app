import { Recipe } from "src/recipe/entities/recipe.entity";
import { OneToMany } from "typeorm";
import { User } from "src/user/entities/user.entity";


export class Admin extends User {
    
    @OneToMany(() => Recipe, recipe => recipe.validatedBy)
    validatedRecipes: Recipe[];

    @OneToMany(() => User, user => user.deletedBy)
    deletedUsers: User[];

}
