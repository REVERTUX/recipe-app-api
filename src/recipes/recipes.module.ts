import { Module } from '@nestjs/common';

import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecipesRepository } from './recipes.repository';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  imports: [PrismaModule],
})
export class RecipesModule {}
