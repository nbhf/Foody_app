import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService  extends BaseService<UserEntity> {}
