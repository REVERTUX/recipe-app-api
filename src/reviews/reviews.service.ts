import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}
  async createReview(review: Prisma.ReviewCreateInput) {
    const newReview = await this.prisma.review.create({ data: review });
    this.updateRecipeRating(newReview.id);
    return newReview;
  }

  getReviews(recipeId: string) {
    return this.prisma.review.findMany({ where: { recipeId } });
  }

  getReview(id: string) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  async updateRecipeRating(recipeId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { recipeId: recipeId },
    });

    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalScore / reviews.length;

    await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { rating: averageRating },
    });

    return reviews;
  }
}
