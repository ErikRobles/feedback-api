import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.shema';
import { CreateFeedbackDto } from './dto/feedback.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().exec();
  }

  async create(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ id: string; text: string; rating: number }> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    const savedFeedback = await createdFeedback.save();

    return {
      id: savedFeedback._id.toString(),
      text: savedFeedback.text,
      rating: savedFeedback.rating,
    };
  }

  async delete(id: string): Promise<Feedback> {
    return this.feedbackModel.findByIdAndDelete(id).exec();
  }

  async update(
    id: string,
    updateFeedbackDto: CreateFeedbackDto,
  ): Promise<{ id: string; text: string; rating: number }> {
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .exec();

    if (!updatedFeedback) {
      throw new Error('Feedback not found or failed to update');
    }

    return {
      id: updatedFeedback._id.toString(),
      text: updatedFeedback.text,
      rating: updatedFeedback.rating,
    };
  }
}
