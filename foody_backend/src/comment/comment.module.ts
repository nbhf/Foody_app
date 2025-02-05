import { Module } from '@nestjs/common';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment,Recipe]),NotificationModule],  // Correctement importé
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [TypeOrmModule]
})
export class CommentModule {}
