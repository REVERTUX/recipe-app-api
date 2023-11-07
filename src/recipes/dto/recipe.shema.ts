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

  @Prop({ required: true, type: JSON })
  blocks: JSON;

  @Prop({ required: true })
  version: number;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
