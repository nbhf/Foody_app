import { ManyToOne } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column ,CreateDateColumn ,BeforeUpdate } from 'typeorm';
import { User } from "src/user/entities/user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

 @CreateDateColumn()
    createdAt: Date;
  
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    author: User;

    @Column({ default: 0 }) // Ajout du compteur de reports
  report: number;

  @BeforeUpdate()
    async checkReportThreshold() {
      if (this.report >= 4) {
        throw new Error('Ce commentaire a été signalé trop de fois et sera supprimé.');
      }
    }
}