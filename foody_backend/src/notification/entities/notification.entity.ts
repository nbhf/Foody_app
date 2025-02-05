import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { TimestampEntites } from 'src/common/timestamp.entites.';

@Entity()
export class Notification extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, user => user.notifications, { nullable: true,onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Admin, admin => admin.notifications, { nullable: true , onDelete: 'CASCADE'})
  admin: Admin;
}
