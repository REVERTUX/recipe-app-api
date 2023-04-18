import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async createRecipe(recipe: Prisma.RecipeCreateInput): Promise<Recipe | null> {
    const {
      calories,
      description,
      image,
      servings,
      title,
      categories,
      cookingTime,
      nutrients,
      recipeIngredient,
      steps,
    } = recipe;

    return this.prisma.recipe.create({
      data: {
        calories,
        description,
        image,
        servings,
        title,
        categories,
        cookingTime,
        nutrients,
        recipeIngredient,
        steps,
      },
    });
  }

  createSteps(steps: Prisma.RecipeStepCreateInput[], id: string) {
    return this.prisma.recipeStep.createMany({
      data: steps.map((e) => ({ ...e, recipeId: id })),
    });
  }

  getRecipes(): Promise<Recipe[]> {
    return this.prisma.recipe.findMany();
  }

  getRecipe(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  updateRecipe(
    id: string,
    recipe: Prisma.RecipeUpdateInput,
  ): Promise<Recipe | null> {
    const {
      calories,
      description,
      image,
      servings,
      title,
      categories,
      cookingTime,
      nutrients,
      recipeIngredient,
      steps,
    } = recipe;
    return this.prisma.recipe.update({
      data: {
        calories,
        description,
        image,
        servings,
        title,
        categories,
        cookingTime,
        nutrients,
        recipeIngredient,
        steps,
      },
      where: { id },
    });
  }

  removeRecipe(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
