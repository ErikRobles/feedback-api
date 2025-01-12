import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  rating: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
