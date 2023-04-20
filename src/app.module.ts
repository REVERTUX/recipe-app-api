import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesController } from './recipes/recipes.controller';
import { RecipesService } from './recipes/recipes.service';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './modules/tweets/tweets.module';

@Module({
  imports: [ReviewsModule, PrismaModule, RecipesModule, UsersModule, TweetsModule],
  controllers: [AppController, RecipesController],
  providers: [AppService, RecipesService],
})
export class AppModule {}
