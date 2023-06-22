import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import JwtAllowAllGuard from 'src/authentication/jwt-all.guard';
import { UpdateRecipeFavoriteDto } from './dto/update-recipe-favorite.dto';

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
  @UseGuards(JwtAuthenticationGuard)
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
  @UseGuards(JwtAuthenticationGuard)
  createCategory(@Body() category: CreateCategoryDto) {
    return this.recipesService.createCategory(category.name);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createRecipe(
    @Req() request: RequestWithUser,
    @Body() recipe: CreateRecipeDto,
  ) {
    return this.recipesService.createRecipe(recipe, request.user.id);
  }

  @Get()
  @UseGuards(JwtAllowAllGuard)
  getRecipes(
    @Req() request: RequestWithUser,
    @Query('search') search?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const userId = request?.user?.id;
    const where: Prisma.RecipeWhereInput = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};
    return this.recipesService.getRecipes(
      {
        take: Number(take) || 10,
        skip: Number(skip) || 0,
        where,
      },
      userId,
    );
  }

  @Get('favorite')
  @UseGuards(JwtAuthenticationGuard)
  getFavoritesRecipes(
    @Req() request: RequestWithUser,
    @Query('search') search?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const userId = request.user.id;
    const where: Prisma.RecipeWhereInput = {};
    if (search) {
      where['OR'] = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    where['Favorite'] = { some: { userId } };

    return this.recipesService.getRecipes(
      {
        take: Number(take) || 10,
        skip: Number(skip) || 0,
        where,
      },
      userId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAllowAllGuard)
  getRecipe(@Req() request: RequestWithUser, @Param('id') recipeId: string) {
    const userId = request?.user?.id;
    return this.recipesService.getRecipe(recipeId, userId);
  }

  // @Patch(':id')
  // updateRecipe(
  //   @Param('id') id: string,
  //   @Body() recipe: Prisma.RecipeUpdateInput,
  // ) {
  //   return this.recipesService.updateRecipe(id, recipe);
  // }

  @Put(':id/favorite')
  @UseGuards(JwtAuthenticationGuard)
  updateRecipeFavorite(
    @Req() request: RequestWithUser,
    @Param('id') recipeId: string,
    @Body() favorite: UpdateRecipeFavoriteDto,
  ) {
    const userId = request.user.id;

    return this.recipesService.updateRecipeFavorite(
      recipeId,
      favorite.favorite,
      userId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  removeRecipe(@Param('id') recipeId: string) {
    return this.recipesService.removeRecipe(recipeId);
  }
}
