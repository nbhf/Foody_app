import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsOptional()
        imgUrl: string
    }

