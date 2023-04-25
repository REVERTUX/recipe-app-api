import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeListView, RecipeView } from './entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(private prisma: PrismaService) {}

  async createRecipe(params: { data: CreateRecipeDto }): Promise<Recipe> {
    const {
      data: {
        calories,
        categories,
        cookingTime,
        description,
        image,
        ingredients,
        nutrients,
        servings,
        steps,
        title,
      },
    } = params;

    return this.prisma.recipe.create({
      data: {
        calories,
        description,
        image,
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
        steps: { createMany: { data: steps } },
      },
    });
  }

  async getRecipes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecipeWhereUniqueInput;
    where?: Prisma.RecipeWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
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
        steps: { select: { id: true, order: true, step: true } },
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

  async createIngredient(name: string) {
    return this.prisma.ingredient.create({ data: { name } });
  }

  //   async createSteps(params: {
  //     data: CreateRecipeStepDto[];
  //   }): Promise<RecipeStep[]> {
  //     const { data } = params;
  //     return this.prisma.$transaction(
  //       data.map((step) => this.prisma.recipeStep.create({ data: step })),
  //     );
  //   }
}
