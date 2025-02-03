// src/comments/comments.service.ts
import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Recipe } from 'src/recipe/entities/recipe.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  // Créer un commentaire
  async create(createCommentDto: CreateCommentDto,user,recipeId: number,): Promise<Comment> {
    const newComment = this.commentsRepository.create(createCommentDto);
    console.log("id de recette",recipeId)
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
    newComment.author =user;
    newComment.recipe=recipe;
    console.log("recette:",recipe);
    return this.commentsRepository.save(newComment);
  }


  async getCommentsForRecipe(recipeId: number): Promise<Comment[]> {
    // On vérifie si la recette existe
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });

    if (!recipe) {
      throw new Error('Recette non trouvée');
    }

    // Récupérer tous les commentaires associés à la recette
    return this.commentsRepository.find({
      where: { recipe: { id: recipeId } },
      relations: ['author', 'recipe'],  // Charge les relations 'author' et 'recipe' pour chaque commentaire
    });
  }


  // Récupérer un commentaire par ID
  async findOne(id: number): Promise<Comment> {
    return this.commentsRepository.findOneBy({ id });
  }

// signaler un commentaire
async reportComment(id: number): Promise<{ deleted: boolean; comment?: Comment }> {
  const comment = await this.commentsRepository.findOne({ where: { id } });

  if (!comment) {
    throw new Error('Commentaire non trouvé');
  }

  // Incrémenter le compteur de signalements
  comment.report = (comment.report || 0) + 1;

  if (comment.report >= 3) {
    await this.commentsRepository.delete(id);
    return { deleted: true }; // Retourner une indication de suppression
  } else {
    const updatedComment = await this.commentsRepository.save(comment);
    return { deleted: false, comment: updatedComment };
  }
}












}
