import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Screen } from '../schemas/screen.schema';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScreensService {
  constructor(@InjectModel(Screen.name) private screenModel: Model<Screen>) {}

  async create(createScreenDto: CreateScreenDto): Promise<Screen> {
    const createdScreen = new this.screenModel({
      id: uuidv4(),
      ...createScreenDto,
      status: 'inactive',
      lastPing: new Date(),
    });
    return createdScreen.save();
  }

  async findAll(): Promise<Screen[]> {
    return this.screenModel.find().exec();
  }

  async findWithinBounds(bounds: {
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
  }): Promise<Screen[]> {
    const { latMin, latMax, lngMin, lngMax } = bounds;
    return this.screenModel
      .find({
        latitude: { $gte: latMin, $lte: latMax },
        longitude: { $gte: lngMin, $lte: lngMax },
      })
      .exec();
  }

  async findOne(id: string): Promise<Screen> {
    return this.screenModel.findOne({ id }).exec();
  }

  async update(id: string, updateScreenDto: UpdateScreenDto): Promise<Screen> {
    return this.screenModel
      .findOneAndUpdate({ id }, updateScreenDto, { new: true })
      .exec();
  }

  async toggleStatus(id: string): Promise<Screen> {
    const screen = await this.findOne(id);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }

    const newStatus = screen.status === 'active' ? 'inactive' : 'active';
    return this.screenModel
      .findOneAndUpdate({ id }, { status: newStatus }, { new: true })
      .exec();
  }

  async assignAnimation(
    screenId: string,
    animationId: string
  ): Promise<Screen> {
    return this.screenModel
      .findOneAndUpdate({ id: screenId }, { animationId }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Screen> {
    return this.screenModel.findOneAndDelete({ id }).exec();
  }
}
