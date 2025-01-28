import { Recipe } from "src/recipe/entities/recipe.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { UserRoleEnum } from "src/user/enums/user-role.enum";
import { Exclude } from "class-transformer";

@Entity('admin')
export class Admin {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 50,
      unique: true
    })
    username: string

      @Column()
      @Exclude()//exclure lors de la transformation d'un objet en JSON ou lors de la désérialisation sécurité
      password: string;

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
