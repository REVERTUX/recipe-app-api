import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

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
  }): Promise<Recipe[]> {
    const { cursor, orderBy, skip, take, where } = params;
    return this.prisma.recipe.findMany({ skip, take, cursor, where, orderBy });
  }

  async getRecipe(params: { where: { id: string } }): Promise<Recipe> {
    const { where } = params;
    return this.prisma.recipe.findUniqueOrThrow({ where });
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

  //   async createSteps(params: {
  //     data: CreateRecipeStepDto[];
  //   }): Promise<RecipeStep[]> {
  //     const { data } = params;
  //     return this.prisma.$transaction(
  //       data.map((step) => this.prisma.recipeStep.create({ data: step })),
  //     );
  //   }
}
