import { Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<Screen> {
    return this.screenModel.findOne({ id }).exec();
  }

  async update(id: string, updateScreenDto: UpdateScreenDto): Promise<Screen> {
    return this.screenModel
      .findOneAndUpdate({ id }, updateScreenDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Screen> {
    return this.screenModel.findOneAndDelete({ id }).exec();
  }
}
