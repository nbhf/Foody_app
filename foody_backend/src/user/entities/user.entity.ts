import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  @Exclude()//exclure lors de la transformation d'un objet en JSON ou lors de la désérialisation sécurité
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;


}