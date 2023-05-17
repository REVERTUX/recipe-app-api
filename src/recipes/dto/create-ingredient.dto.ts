import { IsString, MinLength } from 'class-validator';

export class CreateIngredientDto {
  @IsString({})
  @MinLength(3)
  name: string;
}
