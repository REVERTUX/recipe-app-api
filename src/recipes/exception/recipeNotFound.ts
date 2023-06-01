import { NotFoundException } from '@nestjs/common';

export class RecipeNotFoundException extends NotFoundException {
  constructor(recipeId: string) {
    super(`Recipe with id ${recipeId} not found`);
  }
}
