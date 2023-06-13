import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createReview(
    @Req() request: RequestWithUser,
    @Body() review: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(review, request.user.id);
  }

  @Get()
  getReviews(
    @Query('recipeId') recipeId: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.reviewsService.getReviews({
      take: Number(take) || 10,
      skip: Number(skip) || 0,
      where: { recipeId },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.getReview(id);
  }
}
