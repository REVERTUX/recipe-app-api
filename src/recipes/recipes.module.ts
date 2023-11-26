import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { Recipe, RecipeSchema } from './dto/recipe.shema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  imports: [
    PrismaModule,
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
