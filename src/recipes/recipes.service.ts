import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesRepository } from './recipes.repository';
import { RecipeListView } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipesRepository) {}

  async createRecipe(
    recipe: CreateRecipeDto,
    userId: string,
  ): Promise<Recipe | null> {
    return this.repository.createRecipe({ data: recipe }, userId);
  }

  getRecipes(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.RecipeWhereUniqueInput;
      where?: Prisma.RecipeWhereInput;
      orderBy?: Prisma.RecipeOrderByWithRelationInput;
    },
    userId?: string,
  ): Promise<{ data: RecipeListView[]; count: number }> {
    return this.repository.getRecipes(params, userId);
  }

  getRecipe(id: string, userId?: string): Promise<Recipe> {
    return this.repository.getRecipe({ where: { id } }, userId);
  }

  removeRecipe(id: string): Promise<Recipe | null> {
    return this.repository.removeRecipe({ where: { id } });
  }

  updateRecipeRating(id: string, rating: number) {
    return this.repository.updateRecipeRating(id, rating);
  }

  createIngredient(name: string) {
    if (name.length < 3) {
      throw new HttpException('Name too short', HttpStatus.BAD_REQUEST);
    }

    return this.repository.createIngredient(name);
  }

  getIngredients(params: {
    skip?: number;
    take?: number;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput;
  }): Promise<{ data: { name: string }[]; count: number }> {
    return this.repository.getIngredients(params);
  }

  createCategory(name: string) {
    name = name.trim();
    if (name.length < 3) {
      throw new HttpException('Name too short', HttpStatus.BAD_REQUEST);
    }
    return this.repository.createCategory(name);
  }

  getCategories(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<{ data: { name: string }[]; count: number }> {
    return this.repository.getCategories(params);
  }
}
