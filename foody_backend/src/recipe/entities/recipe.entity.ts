import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import {  RecipeStatus, RecipeType } from "../enums/recipe.enum";
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


    @Column({ type: 'boolean', default: false })
    isValidated: boolean;
    
    @Column({nullable:true})
    imageurl: string;

    @Column({nullable:true})
    description: string;
    //rest of columns....


    @ManyToOne(() => Admin, admin => admin.validatedRecipes)
    validatedBy: Admin;
    @Column({
        type: 'enum',
        enum: RecipeStatus,
        default: RecipeStatus.ON_HOLD 
    })
    status: RecipeStatus;
    
    @CreateDateColumn()
    validatedAt: Date;

    //@ManyToOne(() => Admin, admin => admin.validatedRecipes)
    //validatedBy: Admin;

    @ManyToOne(() => User, user => user.createdRecipes) // Assurez-vous que l'entité User a une relation `createdRecipes`
    createdBy: User;
    
}
