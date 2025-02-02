// src/comments/comments.service.ts
import { Injectable ,NotFoundException } from '@nestjs/common';
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

// signaler un commentaire
async reportComment(id: number): Promise<Comment | null> {
  const comment = await this.commentsRepository.findOne({ where: { id } });

  if (!comment) {
    throw new Error('Commentaire non trouvé');
  }

  // Incrémenter le compteur de signalements
  comment.report = (comment.report || 0) + 1;

  // Si le compteur atteint 3, supprimer le commentaire
  if (comment.report >= 3) {
    await this.commentsRepository.delete(id);
    return null; // Le commentaire a été supprimé
  } else {
    // Sinon, mettre à jour le commentaire
    return await this.commentsRepository.save(comment);
  }
}











}
