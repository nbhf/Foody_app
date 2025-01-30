// src/comments/entities/comment.entity.ts
import { ManyToOne } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column ,CreateDateColumn  } from 'typeorm';
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
}
