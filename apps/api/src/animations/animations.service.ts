import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animation, AnimationDocument } from '../schemas/animation.schema';
import { CreateAnimationDto } from './dto/create-animation.dto';
import { UpdateAnimationDto } from './dto/update-animation.dto';

@Injectable()
export class AnimationsService {
  constructor(
    @InjectModel(Animation.name)
    private animationModel: Model<AnimationDocument>
  ) {}

  async create(createAnimationDto: CreateAnimationDto): Promise<Animation> {
    const createdAnimation = new this.animationModel(createAnimationDto);
    return createdAnimation.save();
  }

  async findAll(): Promise<Animation[]> {
    return this.animationModel.find().populate('widgets').exec();
  }

  async findOne(id: string): Promise<Animation> {
    const animation = await this.animationModel
      .findById(id)
      .populate('widgets')
      .exec();
    if (!animation) {
      throw new NotFoundException(`Animation with ID ${id} not found`);
    }
    return animation;
  }

  async update(
    id: string,
    updateAnimationDto: UpdateAnimationDto
  ): Promise<Animation> {
    const updatedAnimation = await this.animationModel
      .findByIdAndUpdate(id, updateAnimationDto, { new: true })
      .populate('widgets')
      .exec();
    if (!updatedAnimation) {
      throw new NotFoundException(`Animation with ID ${id} not found`);
    }
    return updatedAnimation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.animationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Animation with ID ${id} not found`);
    }
  }
}
