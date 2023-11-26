import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ReviewsModule,
    PrismaModule,
    RecipesModule,
    FilesModule,
    UsersModule,
    AuthenticationModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/recipe',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
