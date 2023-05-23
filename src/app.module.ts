import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesController } from './recipes/recipes.controller';
import { RecipesService } from './recipes/recipes.service';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { FilesModule } from './files/files.module';
import { FilesService } from './files/files.service';

@Module({
  imports: [ReviewsModule, PrismaModule, RecipesModule, FilesModule],
  controllers: [AppController, RecipesController, ReviewsController],
  providers: [AppService, RecipesService, ReviewsService, FilesService],
})
export class AppModule {}
