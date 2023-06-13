import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeListView, RecipeView } from './entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(private prisma: PrismaService) {}

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
        ingredients,
        nutrients,
        servings,
        steps,
        title,
      },
    } = params;

    return this.prisma.recipe.create({
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
        ingredients: { createMany: { data: ingredients } },
        steps: {
          createMany: {
            data: steps.map(({ step }, index) => ({ step, order: index })),
          },
        },
      },
    });
  }

  async getRecipes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecipeWhereUniqueInput;
    where?: Prisma.RecipeWhereInput;
    orderBy?: Prisma.RecipeOrderByWithRelationInput;
  }): Promise<{ data: RecipeListView[]; count: number }> {
    const { cursor, orderBy, skip, take, where } = params;
    const data = await this.prisma.recipe.findMany({
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

    return { data, count };
  }

  async getRecipe(params: { where: { id: string } }): Promise<RecipeView> {
    const { where } = params;
    return this.prisma.recipe.findUniqueOrThrow({
      where,
      include: {
        categories: {
          where: { recipeId: where?.id },
          select: { categoryName: true, id: true },
        },
        nutrients: { select: { carbs: true, fat: true, protein: true } },
        cookingTime: { select: { unit: true, value: true } },
        steps: { select: { id: true, step: true }, orderBy: { order: 'desc' } },
        ingredients: {
          select: {
            id: true,
            amount: true,
            ingredientUnitName: true,
            ingredientName: true,
            description: true,
          },
        },
      },
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

  async getIngredients(params: {
    skip?: number;
    take?: number;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput;
  }): Promise<{ data: { name: string }[]; count: number }> {
    const { orderBy, skip, take, where } = params;
    const data = await this.prisma.ingredient.findMany({
      skip,
      take,
      where,
      orderBy,
      select: { name: true },
    });
    const count = await this.prisma.ingredient.count({ where });

    return { data, count };
  }

  async createIngredient(name: string) {
    return this.prisma.ingredient.create({ data: { name } });
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
    const count = await this.prisma.ingredient.count({ where });

    return { data, count };
  }

  async createCategory(name: string) {
    return this.prisma.category.create({ data: { name } });
  }
}
