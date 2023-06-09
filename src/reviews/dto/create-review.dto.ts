import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  rating: number;

  @IsUUID()
  recipeId: string;
}
