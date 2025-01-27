import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";

export class Recipe {
    @PrimaryGeneratedColumn()
    id: string;

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
