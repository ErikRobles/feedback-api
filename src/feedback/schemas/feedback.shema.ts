import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
  @Prop()
  text: string;

  @Prop()
  rating: number;

  get id() {
    return this['_id'].toString();
  }
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
