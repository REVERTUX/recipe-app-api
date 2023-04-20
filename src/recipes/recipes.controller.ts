import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  createRecipe(@Body() recipe: CreateRecipeDto) {
    return this.recipesService.createRecipe(recipe);
  }

  @Get()
  getRecipes() {
    return this.recipesService.getRecipes();
  }

  @Get(':id')
  getRecipe(@Param('id') id: string) {
    return this.recipesService.getRecipe(id);
  }

  // @Patch(':id')
  // updateRecipe(
  //   @Param('id') id: string,
  //   @Body() recipe: Prisma.RecipeUpdateInput,
  // ) {
  //   return this.recipesService.updateRecipe(id, recipe);
  // }

  @Delete(':id')
  removeRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(id);
  }
}
