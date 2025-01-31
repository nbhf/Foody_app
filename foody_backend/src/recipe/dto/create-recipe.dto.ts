// src/recipe/dto/create-recipe.dto.ts
import { IsEnum, IsNotEmpty, IsArray, IsString, IsNumber, IsOptional } from 'class-validator';
import { RecipeType, RecipeStatus } from '../enums/recipe.enum';
import { ERROR_MESSAGES } from '../../common/error_message';

export class CreateRecipeDto {
    @IsNotEmpty({ message: ERROR_MESSAGES.RECIPE.NAME_REQUIRED })
    @IsString({ message: ERROR_MESSAGES.RECIPE.NAME_STRING })
    name: string;

    @IsArray({ message: ERROR_MESSAGES.RECIPE.INGREDIENTS_ARRAY })
    @IsString({ each: true, message: ERROR_MESSAGES.RECIPE.INGREDIENTS_STRING })
    ingredients: string[];

    @IsArray({ message: ERROR_MESSAGES.RECIPE.INSTRUCTIONS_ARRAY })
    @IsString({ each: true, message: ERROR_MESSAGES.RECIPE.INSTRUCTIONS_STRING })
    instructions: string[];

    @IsEnum(RecipeType, { message: ERROR_MESSAGES.RECIPE.TYPE_ENUM })
    type: RecipeType;

    @IsEnum(RecipeStatus, { message: ERROR_MESSAGES.RECIPE.STATUS_ENUM })
    status: RecipeStatus;

    @IsNumber({}, { message: ERROR_MESSAGES.RECIPE.CREATED_BY_NUMBER })
    createdById: number;

    @IsOptional()
    @IsString({ message: ERROR_MESSAGES.RECIPE.IMAGE_STRING })
    image?: string;
}