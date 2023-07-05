import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaMongoService } from 'src/prisma/prismaMongo.service';
import { CreateRecipeDto, RecipeStepsDto } from './dto/create-recipe.dto';
import { RecipeListView, RecipeView } from './entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(
    private prisma: PrismaService,
    private mongo: PrismaMongoService,
  ) {}

  async createRecipe(
    params: { data: CreateRecipeDto },
    userId: string,
  ): Promise<Recipe> {
    const {
      data: {
        calories,
        categories,
        cookingTime,
        description,
        imageId,
        nutrients,
        servings,
        title,
        steps,
      },
    } = params;

    return await this.prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          userId,
          calories,
          description,
          imageId,
          servings,
          title,
          categories: {
            createMany: {
              data: categories.map(({ categoryName }) => ({ categoryName })),
            },
          },
          cookingTime: { create: { ...cookingTime } },
          nutrients: { create: { ...nutrients } },
        },
      });

      await this.createRecipeSteps(steps, recipe.id);

      return recipe;
    });
  }

  async getRecipes(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.RecipeWhereUniqueInput;
      where?: Prisma.RecipeWhereInput;
      orderBy?: Prisma.RecipeOrderByWithRelationInput;
    },
    userId?: string,
  ): Promise<{ data: RecipeListView[]; count: number }> {
    const { cursor, orderBy, skip, take, where } = params;
    const recipes = await this.prisma.recipe.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        categories: {
          where: { recipeId: where?.id },
          select: { categoryName: true, id: true },
        },
        nutrients: { select: { carbs: true, fat: true, protein: true } },
        cookingTime: { select: { unit: true, value: true } },
      },
    });

    const count = await this.prisma.recipe.count({ where });

    if (userId) {
      const recipesIds = recipes.map(({ id }) => id);

      const favoriteRecipesIds = await this.getFavoriteRecipesIds(
        recipesIds,
        userId,
      );
      const recipesWithAdditionalData = recipes.map((recipe) => ({
        ...recipe,
        favorite: favoriteRecipesIds.includes(recipe.id),
      }));

      return { data: recipesWithAdditionalData, count };
    }

    const recipesWithAdditionalData = recipes.map((recipe) => ({
      ...recipe,
      favorite: false,
    }));

    return { data: recipesWithAdditionalData, count };
  }

  async getRecipe(
    params: { where: { id: string } },
    userId?: string,
  ): Promise<RecipeView> {
    const { where } = params;
    const recipe = await this.prisma.recipe.findUniqueOrThrow({
      where,
      include: {
        categories: {
          where: { recipeId: where?.id },
          select: { categoryName: true, id: true },
        },
        nutrients: { select: { carbs: true, fat: true, protein: true } },
        cookingTime: { select: { unit: true, value: true } },
      },
    });

    const isFavorite = await this.isRecipeUserFavorite(recipe.id, userId);

    const recipeWithAdditionalData = { ...recipe, favorite: isFavorite };

    return recipeWithAdditionalData;
  }

  async getRecipeSteps(id: string) {
    return this.mongo.recipeSteps.findFirst({
      where: { recipeId: id },
      orderBy: { createdAt: 'desc' },
      select: { blocks: true },
    });
  }

  async removeRecipe(params: {
    where: { id: string };
  }): Promise<Recipe | null> {
    const { where } = params;
    return this.prisma.recipe.delete({ where });
  }

  async updateRecipeRating(id: string, rating: number) {
    return this.prisma.recipe.update({ data: { rating }, where: { id } });
  }

  async getCategories(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<{ data: { name: string }[]; count: number }> {
    const { orderBy, skip, take, where } = params;
    const data = await this.prisma.category.findMany({
      skip,
      take,
      where,
      orderBy,
      select: { name: true },
    });
    const count = await this.prisma.category.count({ where });

    return { data, count };
  }

  async createCategory(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  async updateRecipeFavorite(
    recipeId: string,
    favorite: boolean,
    userId: string,
  ) {
    if (favorite) {
      await this.prisma.favorite.create({ data: { userId, recipeId } });
    } else {
      await this.prisma.favorite.delete({
        where: { recipeId_userId: { recipeId, userId } },
      });
    }
  }

  private async getFavoriteRecipesIds(
    recipesId: string[],
    userId?: string,
  ): Promise<string[]> {
    const data = await this.prisma.favorite.findMany({
      select: { recipeId: true },
      where: {
        AND: {
          recipeId: { in: recipesId },
          userId: { equals: userId },
        },
      },
    });
    return data.map(({ recipeId }) => recipeId);
  }

  private async isRecipeUserFavorite(
    recipeId: string,
    userId?: string,
  ): Promise<boolean> {
    const data = await this.prisma.favorite.findFirst({
      select: { recipeId: true },
      where: {
        AND: {
          recipeId: { equals: recipeId },
          userId: { equals: userId },
        },
      },
    });
    return !!data;
  }

  private createRecipeSteps(recipeSteps: RecipeStepsDto, recipeId: string) {
    return this.mongo.recipeSteps.create({
      data: {
        recipeId,
        blocks: recipeSteps.blocks,
        version: recipeSteps.version,
      },
    });
  }
}
