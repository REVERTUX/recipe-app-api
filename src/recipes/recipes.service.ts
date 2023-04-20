import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipesRepository) {}

  async createRecipe(recipe: CreateRecipeDto): Promise<Recipe | null> {
    return this.repository.createRecipe({ data: recipe });
  }

  getRecipes(): Promise<Recipe[]> {
    return this.repository.getRecipes({});
  }

  getRecipe(id: string): Promise<Recipe | null> {
    return this.repository.getRecipe({ where: { id } });
  }

  removeRecipe(id: string): Promise<Recipe | null> {
    return this.repository.removeRecipe({ where: { id } });
  }

  updateRecipeRating(id: string, rating: number) {
    return this.repository.updateRecipeRating(id, rating);
  }
}
