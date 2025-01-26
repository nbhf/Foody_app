import { Controller, Get, Post, Delete, Put, Body, Param} from '@nestjs/common';
import { IBaseService } from './IBase.service'
import { BaseEntity } from './base.entity';

export class BaseController<T extends BaseEntity>{

	constructor(private readonly IBaseService: IBaseService<T>) {}

	@Get()
	async findAll(): Promise<T[]> {
	  return this.IBaseService.getAll()
	}

	@Get(':id')
	async findById(@Param('id') id: number): Promise<T> {
	  return this.IBaseService.get(id)
	}

	@Post()
	async create(@Body() entity: T): Promise<number> {
		return this.IBaseService.create(entity);
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
	  this.IBaseService.delete(id);
	}

	@Put()
	async update(@Body() entity: T): Promise<T> {
	  return this.IBaseService.update(entity);
	}

}