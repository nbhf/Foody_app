// src/comments/comments.service.ts
import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Recipe } from 'src/recipe/entities/recipe.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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


async getUnreportedCommentsForRecipe(recipeId: number, userId: number): Promise<Comment[]> {
  // Vérifier si la recette existe
  const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
  if (!recipe) {
    throw new Error('Recette non trouvée');
  }

  // Requête pour récupérer les commentaires non signalés par l'utilisateur donné
  return this.commentsRepository
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author')  // Charger l'auteur du commentaire
    .leftJoinAndSelect('comment.recipe', 'recipe')  // Charger la recette associée
    .leftJoin('comment.reportedBy', 'reportedUser') // Joindre les utilisateurs ayant signalé ce commentaire
    .where('comment.recipeId = :recipeId', { recipeId }) // Filtrer par recette
    .andWhere(
      `comment.id NOT IN (
        SELECT "commentId" FROM user_reprted_comments WHERE "userId" = :userId
      )`, 
      { userId }
    ) // Exclure les commentaires signalés par l'utilisateur donné
    .getMany();
}




// signaler un commentaire
async reportComment(user, commentId: number): Promise<{ deleted: boolean }> {
  // Vérifier si le commentaire existe
  const comment = await this.commentsRepository.findOne({
    where: { id: commentId },
  });

  if (!comment) {
    console.log(`Commentaire introuvable avec l'ID: ${commentId}`);
    throw new Error('Commentaire introuvable ou déjà supprimé.');
  }

  // Vérifier si l'utilisateur existe et récupérer ses signalements
  const reportingUser = await this.userRepository.findOne({
    where: { id: user.id },
    relations: ['reportedComments'],
  });

  if (!reportingUser) {
    console.log(`Utilisateur introuvable avec l'ID: ${user.id}`);
    throw new Error('Utilisateur introuvable.');
  }

  // Vérifier si l'utilisateur a déjà signalé ce commentaire
  const alreadyReported = reportingUser.reportedComments.some((c) => c.id === commentId);

  if (alreadyReported) {
    throw new Error('Vous avez déjà signalé ce commentaire.');
  }

  // Ajouter le commentaire à la liste des signalements de l'utilisateur
  reportingUser.reportedComments.push(comment);
  await this.userRepository.save(reportingUser);

  // Vérifier combien de fois le commentaire a été signalé
  const reportCount = await this.userRepository
    .createQueryBuilder('user')
    .leftJoin('user.reportedComments', 'comment')
    .where('comment.id = :commentId', { commentId })
    .getCount();

  console.log(`Commentaire ${commentId} signalé ${reportCount} fois.`);

  if (reportCount >= 3) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'reportedComments')
      .of(reportingUser)
      .remove(comment);

    // Vérifier si le commentaire a des relations avec l'auteur (l'utilisateur qui a écrit le commentaire)
    if (comment.author) {
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'comments')
        .of(comment.author)
        .remove(comment);
    }

    // Vérifier si le commentaire est lié à une recette et supprimer la relation
    if (comment.recipe) {
      await this.recipeRepository
        .createQueryBuilder()
        .relation(Recipe, 'comments')
        .of(comment.recipe)
        .remove(comment);
    }

    // Supprimer le commentaire
    await this.commentsRepository.delete(commentId);

    console.log(`Commentaire ${commentId} supprimé après 3 signalements.`);
    return { deleted: true };
  }

  return { deleted: false };
}



}
