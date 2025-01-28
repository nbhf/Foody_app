import { Recipe } from "src/recipe/entities/recipe.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { UserRoleEnum } from "src/user/enums/user-role.enum";

@Entity('admin')
export class Admin {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 50,
      unique: true
    })
    username: string

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.ADMIN
      })
      role: string;
    
    
    @OneToMany(() => Recipe, recipe => recipe.validatedBy)
    validatedRecipes: Recipe[];

    @OneToMany(() => User, user => user.deletedBy)
    deletedUsers: User[];

}
