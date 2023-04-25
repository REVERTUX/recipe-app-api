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

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

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
    return this.recipesService.getRecipes({
      take,
      skip,
      where: {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      },
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

  @Post('categories')
  createIngredient(@Param('name') name: string) {
    return this.recipesService.createIngredient(name);
  }
}
