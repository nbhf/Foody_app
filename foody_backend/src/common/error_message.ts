// src/constants/error-messages.ts
export const ERROR_MESSAGES = {
    RECIPE: {
        NAME_REQUIRED: 'Le nom de la recette est obligatoire.',
        NAME_STRING: 'Le nom de la recette doit être une chaîne de caractères.',
        INGREDIENTS_ARRAY: 'Les ingrédients doivent être fournis sous forme de tableau.',
        INGREDIENTS_STRING: 'Chaque ingrédient doit être une chaîne de caractères.',
        INSTRUCTIONS_ARRAY: 'Les instructions doivent être fournies sous forme de tableau.',
        INSTRUCTIONS_STRING: 'Chaque instruction doit être une chaîne de caractères.',
        TYPE_ENUM: 'Le type de recette doit être breakfast, lunch ou dinner.',
        STATUS_ENUM: 'Le statut de la recette doit être approved ou on_hold.',
        CREATED_BY_NUMBER: "L'ID de l'utilisateur doit être un nombre.",
        IMAGE_STRING: "L'image doit être une chaîne de caractères (URL ou chemin).",
    },
    USER: {
        NOT_FOUND: "L'utilisateur spécifié n'existe pas.",   
        NAME_TOO_SHORT: 'Le nom doit contenir au moins 3 caractères.',
        NAME_TOO_LONG: 'Le nom ne peut pas dépasser 10 caractères.',
        NAME_REQUIRED: 'Le nom est obligatoire.',
        STATUS_REQUIRED: 'Le statut est obligatoire.',
        INVALID_STATUS: 'Le statut doit être une des valeurs permises.',
        STRING:'Doit etre une chaine',
        PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères.' ,
    },
};