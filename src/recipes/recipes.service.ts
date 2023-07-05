import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesRepository } from './recipes.repository';
import { RecipeListView, RecipeStepsView } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipesRepository) {}

  private readonly logger = new Logger(RecipesService.name);

  async createRecipe(
    recipe: CreateRecipeDto,
    userId: string,
  ): Promise<Recipe | null> {
    this.logger.log(
      `Creating new recipe with title ${recipe.title}. User ${userId} `,
    );
    const data = this.repository.createRecipe({ data: recipe }, userId);

    this.logger.log(
      `Created new recipe with title ${recipe.title} User ${userId} `,
    );
    return data;
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

  async getRecipeSteps(id: string): Promise<RecipeStepsView> {
    try {
      const data = await this.repository.getRecipeSteps(id);

      if (!data) {
        throw new HttpException('Recipe steps not found', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new HttpException(
        'Something went wrong during recipe steps query',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  removeRecipe(id: string): Promise<Recipe | null> {
    return this.repository.removeRecipe({ where: { id } });
  }

  updateRecipeRating(id: string, rating: number) {
    return this.repository.updateRecipeRating(id, rating);
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

  async updateRecipeFavorite(
    recipeId: string,
    favorite: boolean,
    userId: string,
  ) {
    this.logger.log(
      `Updating recipe ${recipeId} favorite flag to ${favorite}. User ${userId} `,
    );
    await this.repository.updateRecipeFavorite(recipeId, favorite, userId);
    this.logger.log(
      `Updated recipe ${recipeId} favorite flag to ${favorite}. User ${userId} `,
    );
  }
}
