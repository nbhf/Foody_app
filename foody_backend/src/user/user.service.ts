import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Crée un nouvel utilisateur avec vérifications
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkEmailUniqueness(createUserDto.email); // Vérifier si l'email est unique
    const hashedPassword = await this.hashPassword(createUserDto.password); // Hacher le mot de passe

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword.hash,
      salt: hashedPassword.salt,
    });

    return await this.userRepository.save(newUser);
  }

  // Met à jour un utilisateur existant avec vérifications
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkEmailUniqueness(updateUserDto.email);
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.hashPassword(updateUserDto.password);
      user.password = hashedPassword.hash;
      user.salt = hashedPassword.salt;
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    return await this.userRepository.save(user);
  }

  // Récupère tous les utilisateurs
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'role'], // Exclure les champs sensibles
    });
  }

  // Récupère un utilisateur par ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role'], // Exclure les champs sensibles
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

  // Hache un mot de passe avec bcrypt
  private async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }
}
