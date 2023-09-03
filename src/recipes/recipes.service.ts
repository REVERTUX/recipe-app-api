import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { CreateRecipeDto, RecipeStepsDto } from './dto/create-recipe.dto';
import { RecipesRepository } from './recipes.repository';
import { RecipeListView, RecipeStepsView } from './entities/recipe.entity';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeNotFoundException } from './exception/recipeNotFound';

@Injectable()
export class RecipesService {
  constructor(private repository: RecipesRepository) {}

  private readonly logger = new Logger(RecipesService.name);

  async createRecipe(
    recipe: CreateRecipeDto,
    userId: string,
  ): Promise<Recipe | null> {
    this.logger.log(
      `Creating new recipe with title ${recipe.title} user ${userId} `,
    );
    const data = this.repository.createRecipe({ data: recipe }, userId);

    this.logger.log(
      `Created new recipe with title ${recipe.title} user ${userId} `,
    );
    return data;
  }

  async updateRecipe(
    recipe: UpdateRecipeDto,
    recipeId: string,
    userId: string,
  ) {
    const isOwner = await this.checkUserRecipeOwnership(recipeId, userId);

    if (!isOwner) {
      this.logger.error(
        `User ${userId} has no right to update recipe ${recipeId}`,
      );
      throw new UnauthorizedException(`User has no right to modify recipe`);
    }

    this.logger.log(`Updating recipe with id ${recipeId} and user ${userId}`);

    const updatedRecipe = this.repository.updateRecipe(recipe, recipeId);

    this.logger.log(`Updated recipe with id ${recipeId} and user ${userId}`);

    return updatedRecipe;
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

  async updateRecipeSteps(
    steps: RecipeStepsDto,
    recipeId: string,
    userId: string,
  ) {
    const isOwner = await this.checkUserRecipeOwnership(recipeId, userId);

    if (!isOwner) {
      this.logger.error(
        `User ${userId} has no right to update recipe steps ${recipeId}`,
      );
      throw new UnauthorizedException(
        `User has no right to modify recipe steps`,
      );
    }

    this.logger.log(`Creating recipe steps for ${recipeId} and user ${userId}`);

    const data = await this.repository.createRecipeSteps(steps, recipeId);

    this.logger.log(`Updated recipe steps for ${recipeId} and user ${userId}`);

    return data;
  }

  async getRecipeSteps(id: string): Promise<RecipeStepsView> {
    try {
      const data = await this.repository.getRecipeSteps(id);

      if (!data) {
        throw new HttpException(
          `Recipe steps not found for recipe - ${id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
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

  async checkUserRecipeOwnership(
    recipeId: string,
    userId: string,
  ): Promise<boolean> {
    const recipeUser = await this.repository.getRecipeUserId(recipeId);
    if (!recipeUser) {
      throw new RecipeNotFoundException(recipeId);
    }

    return recipeUser.userId === userId;
  }
}
