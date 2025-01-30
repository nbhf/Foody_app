import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  
// Met à jour un utilisateur existant avec validation
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
// Vérification et mise à jour de l'email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkEmailUniqueness(updateUserDto.email);
      user.email = updateUserDto.email;
    }
 // Mise à jour du mot de passe avec hachage si fourni
    if (updateUserDto.password) {
              user.salt = await bcrypt.genSalt();
              user.password = await bcrypt.hash(user.password, user.salt);
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    return this.userRepository.save(user);
  }


// Récupère un utilisateur par son ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role'],
    });

    if (!user) throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable.`);
    return user;
  }

 // Supprime un utilisateur par ID
  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

 // Vérifie si un email est unique
  private async checkEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
  }

  isOwnerOrAdmin(objet, user) {
    return user.role === UserRoleEnum.ADMIN || (objet.user && objet.createdBy.id === user.id);
  }
}
