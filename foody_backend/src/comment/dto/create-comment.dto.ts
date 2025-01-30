// src/comments/dto/create-comment.dto.ts
import { IsString, IsNotEmpty,IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsInt()
  authorId: number; // ID de l'utilisateur qui écrit le commentaire

  
}
