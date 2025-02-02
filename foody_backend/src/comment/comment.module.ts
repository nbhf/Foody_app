import { Module } from '@nestjs/common';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],  // Correctement importé
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [TypeOrmModule]
})
export class CommentModule {}
