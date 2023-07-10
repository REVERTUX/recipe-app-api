import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateRecipeDto extends OmitType(PartialType(CreateRecipeDto), [
  'steps',
] as const) {}
