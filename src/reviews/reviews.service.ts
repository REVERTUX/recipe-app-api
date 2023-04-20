import { Injectable } from '@nestjs/common';

import { RecipesService } from 'src/recipes/recipes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private repository: ReviewsRepository,
    private recipesService: RecipesService,
  ) {}

  async createReview(review: CreateReviewDto) {
    const newReview = await this.repository.createReview({ data: review });
    this.updateRecipeRating(newReview.id);
    return newReview;
  }

  getReviews(recipeId: string) {
    return this.repository.getReviews({ where: { recipeId } });
  }

  getReview(id: string) {
    this.repository.getReview({ where: { id } });
  }

  async updateRecipeRating(recipeId: string): Promise<void> {
    const reviews = await this.prisma.review.findMany({
      where: { recipeId: recipeId },
    });

    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalScore / reviews.length;

    await this.recipesService.updateRecipeRating(recipeId, averageRating);
  }
}
