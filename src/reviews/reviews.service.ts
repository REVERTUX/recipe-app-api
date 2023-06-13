import { Injectable } from '@nestjs/common';

import { RecipesService } from 'src/recipes/recipes.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { Prisma, Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private repository: ReviewsRepository,
    private recipesService: RecipesService,
  ) {}

  async createReview(review: CreateReviewDto, userId: string): Promise<Review> {
    const newReview = await this.repository.createReview(
      { data: review },
      userId,
    );
    this.updateRecipeRating(newReview.id);
    return newReview;
  }

  getReviews(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReviewWhereUniqueInput;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<{ data: Review[]; count: number }> {
    return this.repository.getReviews(params);
  }

  getReview(id: string): Promise<Review> {
    return this.repository.getReview({ where: { id } });
  }

  async updateRecipeRating(recipeId: string): Promise<void> {
    const reviews = await this.getReviews({ where: { recipeId } });

    const totalScore = reviews.data.reduce(
      (sum, { rating }) => sum + rating,
      0,
    );
    const averageRating = totalScore / reviews.count;

    await this.recipesService.updateRecipeRating(recipeId, averageRating);
  }
}
