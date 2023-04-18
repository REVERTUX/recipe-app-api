import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  createReview(@Body() review: Prisma.ReviewCreateInput) {
    return this.reviewsService.createReview(review);
  }

  @Get()
  getReviews(@Param('recipeId') recipeId: string) {
    return this.reviewsService.getReviews(recipeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.getReview(id);
  }
}
