// src/comments/comments.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Créer un commentaire
  @UseGuards (JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto
     ,@User() user): Promise<Comment> {
    return this.commentsService.create(createCommentDto,user);
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
