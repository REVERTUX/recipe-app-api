// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

const recipe: Prisma.RecipeCreateInput = {
  title: 'Pesto Pasta',
  image: 'https://example.com/images/pesto-pasta.jpg',
  description: 'Delicious and easy pesto pasta recipe',
  calories: 500,
  rating: 4.5,
  servings: 4,
};

const cookingTime = { value: 1, unit: 'h' };

const categories = ['dinner', 'meat'];

const nutrients = {
  fat: 18,
  protein: 15,
  carbs: 70,
};

const ingredientUnits = [
  'pound',
  'cup',
  'clove',
  'to taste',
  'g',
  'kg',
  'ml',
  'l',
  'piece',
  'tbsp',
  'teaspoon',
];
const ingredients = [
  'pasta',
  'pesto sauce',
  'parmesan cheese',
  'cherry tomatoes',
  'garlic',
  'olive oil',
  'salt and pepper',
];

const recipeIngredients = [
  { name: 'pasta', amount: 1, unit: 'pound' },
  { name: 'pesto sauce', amount: 1, unit: 'cup' },
  { name: 'parmesan cheese', amount: 0.5, unit: 'cup' },
  { name: 'cherry tomatoes', amount: 1, unit: 'cup' },
  { name: 'garlic', amount: 2, unit: 'clove' },
  {
    name: 'olive oil',
    amount: 2,
    unit: 'tbsp',
    description: 'May be vegetable oil',
  },
  { name: 'salt and pepper', amount: 0, unit: 'to taste' },
];

const reviews = [
  {
    user: 'Alice',
    rating: 5,
    comment: 'This was amazing! Definitely making it again.',
  },
  {
    user: 'Bob',
    rating: 4,
    comment:
      'Great recipe! I added some grilled chicken to mine and it turned out really well.',
  },
];

const steps = [
  { order: 1, step: 'Bring a large pot of salted water to a boil.' },
  {
    order: 2,
    step: 'Cook pasta according to package instructions until al dente.',
  },
  {
    order: 3,
    step: 'While the pasta is cooking, heat olive oil in a large pan over medium heat. Add garlic and cherry tomatoes and cook until the tomatoes are soft and starting to burst.',
  },
  {
    order: 4,
    step: 'Add the cooked pasta, pesto sauce, and parmesan cheese to the pan with the tomatoes. Toss everything together until the pasta is coated in the sauce.',
  },
  { order: 5, step: 'Season with salt and pepper to taste.' },
  { order: 6, step: 'Serve hot.' },
];

async function main() {
  const categories1 = prisma.category.createMany({
    data: categories.map((e) => ({ name: e })),
  });
  const ingredients1 = prisma.ingredient.createMany({
    data: ingredients.map((e) => ({ name: e })),
  });
  const ingredientUnits1 = prisma.ingredientUnit.createMany({
    data: ingredientUnits.map((e) => ({ name: e })),
  });

  // create dummy recipe
  const recipe1 = prisma.recipe.create({
    data: {
      ...recipe,
      reviews: { createMany: { data: reviews } },
      steps: { createMany: { data: steps } },
      nutrients: { create: { ...nutrients } },
      ingredients: {
        createMany: {
          data: recipeIngredients.map((e) => ({
            amount: e.amount,
            ingredientName: e.name,
            ingredientUnitName: e.unit,
          })),
        },
      },
      categories: {
        createMany: { data: categories.map((e) => ({ categoryName: e })) },
      },
      cookingTime: { create: cookingTime },
    },
  });

  prisma.$transaction([categories1, ingredients1, ingredientUnits1, recipe1]);

  console.log({ recipe1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });