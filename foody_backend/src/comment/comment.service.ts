// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  // Créer un commentaire
  async create(createCommentDto: CreateCommentDto,user): Promise<Comment> {
    const newComment = this.commentsRepository.create(createCommentDto);
    newComment.author =user;
    return this.commentsRepository.save(newComment);
  }

  // Récupérer tous les commentaires
  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: ['author'], });
  }

  // Récupérer un commentaire par ID
  async findOne(id: number): Promise<Comment> {
    return this.commentsRepository.findOneBy({ id });
  }
}
