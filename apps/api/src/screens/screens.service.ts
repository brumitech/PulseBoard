import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Screen, ScreenDocument } from '../schemas/screen.schema';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreensService {
  constructor(
    @InjectModel(Screen.name) private screenModel: Model<ScreenDocument>
  ) {}

  async create(createScreenDto: CreateScreenDto): Promise<Screen> {
    const createdScreen = new this.screenModel(createScreenDto);
    return createdScreen.save();
  }

  async findAll(): Promise<Screen[]> {
    return this.screenModel.find().exec();
  }

  async findOne(id: string): Promise<Screen> {
    const screen = await this.screenModel.findById(id).exec();
    if (!screen) {
      throw new NotFoundException(`Screen with ID ${id} not found`);
    }
    return screen;
  }

  async update(id: string, updateScreenDto: UpdateScreenDto): Promise<Screen> {
    const updatedScreen = await this.screenModel
      .findByIdAndUpdate(id, updateScreenDto, { new: true })
      .exec();
    if (!updatedScreen) {
      throw new NotFoundException(`Screen with ID ${id} not found`);
    }
    return updatedScreen;
  }

  async remove(id: string): Promise<void> {
    const result = await this.screenModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Screen with ID ${id} not found`);
    }
  }
}
