import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CookingTimeDto {
  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsUUID()
  recipeId: string;
}

export class NutrientsDto {
  @IsNumber()
  fat: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsUUID()
  recipeId: string;
}

export class CreateRecipeStepDto {
  @IsString()
  @IsNotEmpty()
  step: string;

  @IsNumber()
  order: number;

  @IsUUID()
  recipeId: string;
}

export class RecipeIngredientDto {
  @IsString()
  @IsNotEmpty()
  ingredientName: string;

  @IsString()
  @IsNotEmpty()
  ingredientUnitName: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description: string | undefined;

  @IsUUID()
  recipeId: string;
}

export class RecipeCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsUUID()
  recipeId: string;
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @ValidateNested()
  cookingTime: CookingTimeDto;

  @IsNumber()
  servings: number;

  @ValidateNested()
  nutrients: NutrientsDto;

  @IsNumber()
  calories: number;

  @ValidateNested()
  steps: CreateRecipeStepDto[];

  @ValidateNested()
  ingredients: RecipeIngredientDto[];

  @ValidateNested()
  categories: RecipeCategoryDto[];
}
