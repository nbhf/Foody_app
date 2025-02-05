// src/comments/comments.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards,Patch, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Recipe } from 'src/recipe/entities/recipe.entity';

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

  @Patch('report/:commentId')
  @UseGuards(JwtAuthGuard)
  async reportComment(@User() user,@Param('commentId') commentId:number) {
    const updatedComment = await this.commentsService.reportComment(user,commentId);
    if (!updatedComment) {
      return null; // Le commentaire a été supprimé, retourner null
    }
    return this.commentsService.reportComment( user,commentId);
  }

  @Get(':recipeId/unreported-comments/:userId')
async getUnreportedCommentsForRecipe(
  @Param('recipeId', ParseIntPipe) recipeId: number,
  @Param('userId', ParseIntPipe) userId: number
): Promise<Comment[]> {

  return this.commentsService.getUnreportedCommentsForRecipe(recipeId, userId);
}



}
