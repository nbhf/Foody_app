// src/comments/entities/comment.entity.ts
import { ManyToOne } from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column ,CreateDateColumn ,JoinColumn } from 'typeorm';
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
  @JoinColumn({ name: 'authorId' }) // Lie la colonne `authorId` à la table `users`

    author: User;
}
