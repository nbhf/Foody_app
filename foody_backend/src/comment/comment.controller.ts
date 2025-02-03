// src/comments/comments.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards,Patch } from '@nestjs/common';
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
  @Post(':recipeId')
  create(@Body() createCommentDto: CreateCommentDto
     ,@User() user,@Param('recipeId') recipeId:number): Promise<Comment> {
    return this.commentsService.create(createCommentDto,user,recipeId);
  }

  @Get('recipe/:id')
  @UseGuards(JwtAuthGuard)
  async getCommentsByRecipe(@Param('id') recipeId: number): Promise<Comment[]> {
    return this.commentsService.getCommentsForRecipe(recipeId);
  }
  // findAll(): Promise<Comment[]> {
  //   return this.commentsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @Patch(':id/report')
  @UseGuards(JwtAuthGuard)
  async reportComment(@Param('id') id: number) {
    const updatedComment = await this.commentsService.reportComment(id);
    if (!updatedComment) {
      return null; // Le commentaire a été supprimé, retourner null
    }
    return updatedComment; // Retourner le commentaire mis à jour avec le compteur de signalements
  }

}
