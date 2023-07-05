// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

const user: Prisma.UserCreateInput = {
  email: 'john@example.com',
  name: 'John',
  password: 'xxxxxxxx',
  id: 'fb9fe445-10bd-47f5-99ea-2f7ad76810ad',
};

const recipe: Prisma.RecipeCreateInput = {
  title: 'Pesto Pasta',
  description: 'Delicious and easy pesto pasta recipe',
  calories: 500,
  rating: 4.5,
  servings: 4,
  user: { connect: { id: user.id } },
};

const cookingTime = { value: 1, unit: 'h' };

const categories = ['dinner', 'meat'];

const nutrients = {
  fat: 18,
  protein: 15,
  carbs: 70,
};

const reviews = [
  {
    userId: 'fb9fe445-10bd-47f5-99ea-2f7ad76810ad',
    rating: 5,
    comment: 'This was amazing! Definitely making it again.',
  },
  {
    userId: 'fb9fe445-10bd-47f5-99ea-2f7ad76810ad',
    rating: 4,
    comment:
      'Great recipe! I added some grilled chicken to mine and it turned out really well.',
  },
]

async function main() {
  const categories1 = prisma.category.createMany({
    data: categories.map((e) => ({ name: e })),
    skipDuplicates: true,
  });

  const user1 = prisma.user.createMany({
    data: user,
    skipDuplicates: true,
  });

  // create dummy recipe
  const recipe1 = prisma.recipe.create({
    data: {
      ...recipe,
      user: { connect: { id: 'fb9fe445-10bd-47f5-99ea-2f7ad76810ad' } },
      reviews: { createMany: { data: reviews } },
      nutrients: { create: { ...nutrients } },
      categories: {
        createMany: { data: categories.map((e) => ({ categoryName: e })) },
      },
      cookingTime: { create: cookingTime },
    },
  });

  prisma.$transaction([
    user1,
    categories1,
    recipe1,
  ]);

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
