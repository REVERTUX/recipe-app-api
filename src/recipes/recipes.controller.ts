import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('ingredients')
  getIngredients(@Query('search') search?: string) {
    const where = search
      ? {
          name: { contains: search },
        }
      : {};
    return this.recipesService.getIngredients({
      where,
    });
  }

  @Post('ingredients')
  createIngredient(@Body() ingredient: CreateIngredientDto) {
    return this.recipesService.createIngredient(ingredient.name);
  }

  @Get('categories')
  getCategories(@Query('search') search?: string) {
    const where = search
      ? {
          name: { contains: search },
        }
      : {};
    return this.recipesService.getCategories({
      where,
    });
  }

  @Post('categories')
  createCategory(@Body() category: CreateCategoryDto) {
    return this.recipesService.createCategory(category.name);
  }

  @Post()
  createRecipe(@Body() recipe: CreateRecipeDto) {
    return this.recipesService.createRecipe(recipe);
  }

  @Get()
  getRecipes(
    @Query('search') search?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    return this.recipesService.getRecipes({
      take: Number(take) || 10,
      skip: Number(skip) || 0,
      where,
    });
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
