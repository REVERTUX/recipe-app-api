import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaMongoModule } from 'src/prisma/prismaMongo.module';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { JwtCognitoService } from 'src/authentication/jwtCognito.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository, JwtCognitoService],
  imports: [PrismaModule, PrismaMongoModule, ConfigModule],
  exports: [RecipesService, RecipesRepository, JwtCognitoService],
})
export class RecipesModule {}
