import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { RecipeStatus, RecipeType } from "../enums/recipe.enum";
import { User } from "src/user/entities/user.entity";
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


    @Column({ type: 'boolean', default: false })
    isValidated: boolean;
    
    @CreateDateColumn()
    validatedAt: Date;

    @ManyToOne(() => Admin, admin => admin.validatedRecipes)
    validatedBy: Admin;

    @ManyToOne(() => User, user => user.createdRecipes) // Assurez-vous que l'entité User a une relation `createdRecipes`
    createdBy: User;
    
}
