import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaMongoModule } from 'src/prisma/prismaMongo.module';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  imports: [PrismaModule, PrismaMongoModule],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
