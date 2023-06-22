import { IsBoolean } from 'class-validator';
export class UpdateRecipeFavoriteDto {
  @IsBoolean()
  favorite: boolean;
}
