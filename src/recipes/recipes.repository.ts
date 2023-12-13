import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto, RecipeCategoryDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeListView, RecipeView } from './entities/recipe.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe as MongoRecipe } from './dto/recipe.shema';
import { Model } from 'mongoose';

@Injectable()
export class RecipesRepository {
  constructor(
    private prisma: PrismaService,
    @InjectModel(MongoRecipe.name)
    private readonly recipeModel: Model<MongoRecipe>,
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

  async updateRecipe(recipe: UpdateRecipeDto, recipeId: string) {
    const {
      calories,
      categories,
      cookingTime,
      description,
      imageId,
      nutrients,
      servings,
      title,
    } = recipe;

    this.prisma.$transaction(async (tx) => {
      if (categories) {
        this.updateRecipeCategories(recipeId, categories, tx);
      }

      await tx.recipe.update({
        data: {
          title,
          calories,
          description,
          imageId,
          servings,
          cookingTime: { update: { ...cookingTime } },
          nutrients: { update: { ...nutrients } },
        },
        where: { id: recipeId },
      });
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
    const data = await this.recipeModel.findOne({ id });
    if (!data) {
      return null;
    }

    return { steps: data.steps };
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

  getRecipeUserId(recipeId: string) {
    return this.prisma.recipe.findFirst({
      where: { id: recipeId },
      select: { userId: true },
    });
  }

  createRecipeSteps(recipeSteps: string, recipeId: string) {
    return this.recipeModel.create({
      recipeId,
      steps: recipeSteps,
      createdAt: new Date(),
    });
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

  private async updateRecipeCategories(
    recipeId: string,
    categories: RecipeCategoryDto[],
    tx: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) {
    const existingCategories = await tx.recipeCategory.findMany({
      where: { recipeId },
      select: { categoryName: true, id: true },
    });

    const existingSharedCategories = existingCategories.filter(
      ({ categoryName }) =>
        categories.some((category) => category.categoryName === categoryName),
    );

    const categoriesToAdd = categories.filter(
      ({ categoryName }) =>
        !existingCategories.some(
          (category) => category.categoryName === categoryName,
        ),
    );

    const categoriesToDelete = existingCategories.filter(
      (existingCategory) =>
        !existingSharedCategories.some(
          (category) => existingCategory.categoryName === category.categoryName,
        ),
    );

    const deleteCategories = tx.recipeCategory.deleteMany({
      where: { id: { in: categoriesToDelete.map(({ id }) => id) } },
    });

    const createCategories = tx.recipeCategory.createMany({
      data: categoriesToAdd.map(({ categoryName }) => ({
        categoryName,
        recipeId,
      })),
    });

    return this.prisma.$transaction([deleteCategories, createCategories]);
  }
}
