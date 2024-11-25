import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Keyframe, KeyframeDocument } from '../schemas/keyframe.schema';
import { CreateKeyframeDto } from './dto/create-keyframe.dto';
import { UpdateKeyframeDto } from './dto/update-keyframe.dto';

@Injectable()
export class KeyframesService {
  constructor(
    @InjectModel(Keyframe.name) private keyframeModel: Model<KeyframeDocument>
  ) {}

  async create(createKeyframeDto: CreateKeyframeDto): Promise<Keyframe> {
    const createdKeyframe = new this.keyframeModel(createKeyframeDto);
    return createdKeyframe.save();
  }

  async createMany(
    createKeyframeDtos: CreateKeyframeDto[]
  ): Promise<Keyframe[]> {
    const createdKeyframes = await this.keyframeModel.insertMany(
      createKeyframeDtos
    );
    return createdKeyframes;
  }

  async findAll(): Promise<Keyframe[]> {
    return this.keyframeModel.find().exec();
  }

  async findOne(id: string): Promise<Keyframe> {
    const keyframe = await this.keyframeModel.findById(id).exec();
    if (!keyframe) {
      throw new NotFoundException(`Keyframe with ID ${id} not found`);
    }
    return keyframe;
  }

  async findByWidgetId(widgetId: string): Promise<Keyframe[]> {
    return this.keyframeModel
      .find({ widgetId })
      .sort({ timestamp: 'asc' })
      .exec();
  }

  async update(
    id: string,
    updateKeyframeDto: UpdateKeyframeDto
  ): Promise<Keyframe> {
    const updatedKeyframe = await this.keyframeModel
      .findByIdAndUpdate(id, updateKeyframeDto, { new: true })
      .exec();

    if (!updatedKeyframe) {
      throw new NotFoundException(`Keyframe with ID ${id} not found`);
    }
    return updatedKeyframe;
  }

  async remove(id: string): Promise<void> {
    const result = await this.keyframeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Keyframe with ID ${id} not found`);
    }
  }

  async removeByWidgetId(widgetId: string): Promise<void> {
    const result = await this.keyframeModel.deleteMany({ widgetId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `No keyframes found for widget ID ${widgetId}`
      );
    }
  }

  async validateTimestamps(
    widgetId: string,
    timestamps: number[]
  ): Promise<boolean> {
    const existingKeyframes = await this.findByWidgetId(widgetId);
    const allTimestamps = [
      ...existingKeyframes.map((k) => k.timestamp),
      ...timestamps,
    ];

    // Check for duplicates
    if (new Set(allTimestamps).size !== allTimestamps.length) {
      throw new BadRequestException('Duplicate timestamps are not allowed');
    }

    return true;
  }
}
