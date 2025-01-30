import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { UserRoleEnum } from "src/user/enums/user-role.enum";
import { Exclude } from "class-transformer";
import { TimestampEntites } from "src/common/timestamp.entites.";
import { Recipe } from "src/recipe/entities/recipe.entity";
import { RecipeStatus } from "src/recipe/enums/recipe.enum";

@Entity('admin')
export class Admin extends TimestampEntites{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 50,
      unique: true
    })
    username: string


    @Column({
    unique: true
    })
    email:string

    @Column()
    @Exclude()//exclure lors de la transformation d'un objet en JSON ou lors de la désérialisation sécurité
    password: string;

    @Column({
      type: 'enum',
      enum: UserRoleEnum,
      default: UserRoleEnum.ADMIN
    })
    role: string;
    
    @Column()
    @Exclude()
    salt: string;

}
