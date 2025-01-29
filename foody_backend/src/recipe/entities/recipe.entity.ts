import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { TimestampEntites } from "src/common/timestamp.entites.";

@Entity('recipe')
export class Recipe extends TimestampEntites{
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({
        unique: true
    })
    name: string;

    @Column("simple-array")
    ingredients: string[];

    @Column("simple-array")
    instructions: string[];

    @Column({ type: 'boolean', default: false })
    isValidated: boolean;
    
    //rest of columns....

    @ManyToOne(() => Admin, admin => admin.validatedRecipes)
    validatedBy: Admin;
}
