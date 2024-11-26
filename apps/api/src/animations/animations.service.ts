import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animation } from '../schemas/animation.schema';
import { CreateAnimationDto } from './dto/create-animation.dto';
import { UpdateAnimationDto } from './dto/update-animation.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AnimationsService {
  constructor(
    @InjectModel(Animation.name) private animationModel: Model<Animation>
  ) {}

  async create(createAnimationDto: CreateAnimationDto): Promise<Animation> {
    const createdAnimation = new this.animationModel({
      id: uuidv4(),
      ...createAnimationDto,
    });
    return createdAnimation.save();
  }

  async findAll(): Promise<Animation[]> {
    return this.animationModel.find().exec();
  }

  async findOne(id: string): Promise<Animation> {
    return this.animationModel.findOne({ id }).exec();
  }

  async update(
    id: string,
    updateAnimationDto: UpdateAnimationDto
  ): Promise<Animation> {
    return this.animationModel
      .findOneAndUpdate({ id }, updateAnimationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Animation> {
    return this.animationModel.findOneAndDelete({ id }).exec();
  }
}
