import { Prisma } from '@prisma/client';
import { Prisma as PrismaMongo } from '@prismany/client/mongo';

const recipeListView = Prisma.validator<Prisma.RecipeArgs>()({
  include: {
    categories: {
      select: { categoryName: true, id: true },
    },
    nutrients: { select: { carbs: true, fat: true, protein: true } },
    cookingTime: { select: { unit: true, value: true } },
  },
});

const recipeData = Prisma.validator<Prisma.RecipeArgs>()({
  select: {
    id: true,
    description: true,
    title: true,
    image: true,
    calories: true,
    creationDate: true,
    rating: true,
    servings: true,
  },
});

export type RecipeListView = Prisma.RecipeGetPayload<typeof recipeListView>;

const recipeView = Prisma.validator<Prisma.RecipeArgs>()({
  include: {
    categories: {
      select: { categoryName: true, id: true },
    },
    nutrients: { select: { carbs: true, fat: true, protein: true } },
    cookingTime: { select: { unit: true, value: true } },
  },
});

export type RecipeView = Prisma.RecipeGetPayload<typeof recipeView>;

const recipeSteps = Prisma.validator<PrismaMongo.RecipeStepsArgs>()({
  select: {
    blocks: true,
  },
});

export type RecipeStepsView = PrismaMongo.RecipeStepsGetPayload<
  typeof recipeSteps
>;
