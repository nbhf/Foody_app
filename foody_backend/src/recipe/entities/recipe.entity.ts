import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";

@Entity('recipe')
export class Recipe {
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
    
    //rest of columns....

    @ManyToOne(() => Admin, admin => admin.validatedRecipes)
    validatedBy: Admin;
}
