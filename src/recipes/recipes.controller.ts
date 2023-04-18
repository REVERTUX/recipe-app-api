import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { RecipesService } from './recipes.service';

export type RecipeCreateDto = Omit<
  Prisma.RecipeCreateInput,
  'id' | 'rating' | 'creationDate'
>;

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  createRecipe(@Body() recipe: Prisma.RecipeCreateInput) {
    return this.recipesService.createRecipe(recipe);
  }

  @Get()
  getRecipes() {
    return this.recipesService.getRecipes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.getRecipe(id);
  }

  @Patch(':id')
  updateRecipe(
    @Param('id') id: string,
    @Body() recipe: Prisma.RecipeUpdateInput,
  ) {
    return this.recipesService.updateRecipe(id, recipe);
  }

  @Delete(':id')
  removeRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(id);
  }
}
