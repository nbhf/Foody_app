import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import {  RecipeStatus, RecipeType } from "../enums/recipe.enum";
import { User } from "src/user/entities/user.entity";
import { TimestampEntites } from "src/common/timestamp.entites.";
import { trace } from "node:console";

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

    @Column({ type: 'text',nullable:true })
    description: string;  
  
    @Column({nullable: true })
    imgUrl: string; 

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

    @ManyToOne(() => User, (user) => user.createdRecipes)
    @JoinColumn({ name: 'createdById' }) // This defines the foreign key
    createdBy: User;

    @ManyToMany(() => User, user => user.savedRecipes) 
    savedBy: User;
}