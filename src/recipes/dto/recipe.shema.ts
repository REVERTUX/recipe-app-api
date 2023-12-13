import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  recipeId: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true })
  steps: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
