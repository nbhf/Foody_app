// src/comments/comments.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Créer un commentaire
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }
}
