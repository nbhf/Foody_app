import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany,JoinTable} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Admin } from "src/admin/entities/admin.entity";
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { TimestampEntites } from 'src/common/timestamp.entites.';
import { Notification } from 'src/notification/entities/notification.entity';

@Entity('user')
export class User extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  @Exclude()//exclure lors de la transformation d'un objet en JSON ou lors de la désérialisation sécurité
  password: string;

  @Column()
  @Exclude()
  salt: string;


  @Column({ nullable: true })
  imgUrl: string;



  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;  
   
  @OneToMany(() => Recipe, recipe => recipe.createdBy)
  createdRecipes: Recipe[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];


  
  @ManyToMany(() => Recipe, (recipe) => recipe.savedBy)
  @JoinTable({name:"user_saved_recipes"})
  savedRecipes: Recipe[];


  @OneToMany(() => Notification, notification => notification.user, {cascade: true})
  notifications: Notification[];

  @ManyToMany(() => Comment)
  @JoinTable()
  reportedComments: Comment[];

}