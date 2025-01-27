import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const newAdmin = this.adminRepository.create(createAdminDto);
    return await this.adminRepository.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    return await this.adminRepository.findOneBy({ id });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    await this.adminRepository.update(id, updateAdminDto);
    return await this.adminRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.adminRepository.delete(id);
  }
}
