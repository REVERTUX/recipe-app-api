import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  imports: [PrismaModule],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
