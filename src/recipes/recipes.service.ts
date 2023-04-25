import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesRepository } from './recipes.repository';
import { RecipeListView } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipesRepository) {}

  async createRecipe(recipe: CreateRecipeDto): Promise<Recipe | null> {
    return this.repository.createRecipe({ data: recipe });
  }

  getRecipes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecipeWhereUniqueInput;
    where?: Prisma.RecipeWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<{ data: RecipeListView[]; count: number }> {
    return this.repository.getRecipes(params);
  }

  getRecipe(id: string): Promise<Recipe> {
    return this.repository.getRecipe({ where: { id } });
  }

  removeRecipe(id: string): Promise<Recipe | null> {
    return this.repository.removeRecipe({ where: { id } });
  }

  updateRecipeRating(id: string, rating: number) {
    return this.repository.updateRecipeRating(id, rating);
  }

  createIngredient(name: string) {
    return this.repository.createIngredient(name);
  }
}
