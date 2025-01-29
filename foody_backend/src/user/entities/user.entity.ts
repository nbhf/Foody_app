import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Admin } from "src/admin/entities/admin.entity";


@Entity('user')
export class User {

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

  //@Column()
  //@Exclude()
  //salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;

  @ManyToOne(() => Admin, admin => admin.deletedUsers, { nullable: true })
  deletedBy: Admin | null;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}