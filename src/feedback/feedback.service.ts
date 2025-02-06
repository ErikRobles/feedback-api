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

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    const savedFeedback = await createdFeedback.save();

    return savedFeedback.toObject();
  }

  async delete(id: string): Promise<Feedback | null> {
    try {
      console.log('🔍 Deleting from database with ID:', id);

      // Convert `id` to ObjectId if needed (for MongoDB)
      const objectId = new mongoose.Types.ObjectId(id);

      const deletedFeedback =
        await this.feedbackModel.findByIdAndDelete(objectId);

      if (!deletedFeedback) {
        console.error('❌ Feedback not found:', id);
        return null;
      }

      console.log('✅ Deleted successfully:', deletedFeedback);
      return deletedFeedback;
    } catch (error) {
      console.error('❌ Error deleting from MongoDB:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .exec();

    if (!updatedFeedback) {
      throw new Error('Feedback not found or failed to update');
    }

    return updatedFeedback.toObject();
  }
}
