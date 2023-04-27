import { Injectable } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private prisma: PrismaService) {}

  async createReview(params: { data: CreateReviewDto }): Promise<Review> {
    const { data } = params;
    return await this.prisma.review.create({ data });
  }

  getReview(params: { where: { id: string } }): Promise<Review> {
    const { where } = params;
    return this.prisma.review.findUniqueOrThrow({ where });
  }

  async getReviews(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReviewWhereUniqueInput;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<{ data: Review[]; count: number }> {
    const { skip, take, where } = params;
    const data = await this.prisma.review.findMany({
      where,
      take,
      skip,
      orderBy: { creationDate: 'desc' },
    });
    const count = await this.prisma.review.count({ where });
    return { data, count };
  }
}
