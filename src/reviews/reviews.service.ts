import { Injectable } from '@nestjs/common';

import { RecipesService } from 'src/recipes/recipes.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private repository: ReviewsRepository,
    private recipesService: RecipesService,
  ) {}

  async createReview(review: CreateReviewDto): Promise<Review> {
    const newReview = await this.repository.createReview({ data: review });
    this.updateRecipeRating(newReview.id);
    return newReview;
  }

  getReviews(recipeId: string): Promise<Review[]> {
    return this.repository.getReviews({ where: { recipeId } });
  }

  getReview(id: string): Promise<Review> {
    return this.repository.getReview({ where: { id } });
  }

  async updateRecipeRating(recipeId: string): Promise<void> {
    const reviews = await this.getReviews(recipeId);

    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalScore / reviews.length;

    await this.recipesService.updateRecipeRating(recipeId, averageRating);
  }
}
