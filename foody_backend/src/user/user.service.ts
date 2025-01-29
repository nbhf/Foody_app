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

  // Crée un nouvel utilisateur avec validation et hachage du mot de passe
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkEmailUniqueness(createUserDto.email);
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }
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
      user.password = await this.hashPassword(updateUserDto.password);
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
// Hache un mot de passe avec bcryptjs
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
