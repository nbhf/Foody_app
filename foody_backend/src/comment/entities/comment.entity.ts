import { JoinColumn, ManyToOne , ManyToMany } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column ,CreateDateColumn ,BeforeUpdate } from 'typeorm';
import { User } from "src/user/entities/user.entity";
import { Recipe } from "src/recipe/entities/recipe.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

 @CreateDateColumn()
    createdAt: Date;

   @Column({ default: 0 }) // Ajout du compteur de reports
    report: number;
  
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    author: User;

 
  @BeforeUpdate()
    async checkReportThreshold() {
      if (this.report >=3) {
        throw new Error('Ce commentaire a été signalé trop de fois et sera supprimé.');
      }
    }

  @ManyToOne(() => Recipe, (recipe) => recipe.comments,{ onDelete: 'CASCADE' })  
  @JoinColumn({ name: 'recipeId' }) 
   recipe: Recipe;
  
   @ManyToMany(() => User, (user) => user.reportedComments ,{ onDelete: 'CASCADE' })
   reportedBy: User[];
}