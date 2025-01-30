import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import {  RecipeType } from "../enums/recipe.enum";
import { User } from "src/user/entities/user.entity";
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

    @Column({
        type: 'enum',
        enum: RecipeType,
        default: RecipeType.LUNCH 
    })
    category: RecipeType;

    @Column({
        type: 'enum',
        enum: RecipeStatus,
        default: RecipeStatus.ON_HOLD 
    })
    status: RecipeStatus;
    
    @CreateDateColumn()
    validatedAt: Date;

    @ManyToMany(() => User, user => user.createdRecipes) 
    createdBy: User;

    @ManyToMany(() => User, user => user.savedRecipes) 
    savedBy: User;
}
