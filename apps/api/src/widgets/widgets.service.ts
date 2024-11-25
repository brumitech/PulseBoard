import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Widget, WidgetDocument } from '../schemas/widget.schema';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectModel(Widget.name) private widgetModel: Model<WidgetDocument>
  ) {}

  async create(createWidgetDto: CreateWidgetDto): Promise<Widget> {
    const createdWidget = new this.widgetModel(createWidgetDto);
    return createdWidget.save();
  }

  async findAll(): Promise<Widget[]> {
    return this.widgetModel.find().populate('keyframes').exec();
  }

  async findOne(id: string): Promise<Widget> {
    const widget = await this.widgetModel
      .findById(id)
      .populate('keyframes')
      .exec();

    if (!widget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
    return widget;
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto): Promise<Widget> {
    const updatedWidget = await this.widgetModel
      .findByIdAndUpdate(id, updateWidgetDto, { new: true })
      .populate('keyframes')
      .exec();

    if (!updatedWidget) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
    return updatedWidget;
  }

  async remove(id: string): Promise<void> {
    const result = await this.widgetModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Widget with ID ${id} not found`);
    }
  }

  // Additional methods specific to widgets
  async findByComponentType(componentType: string): Promise<Widget[]> {
    return this.widgetModel
      .find({ componentType })
      .populate('keyframes')
      .exec();
  }

  async findByDuration(
    minDuration: number,
    maxDuration: number
  ): Promise<Widget[]> {
    return this.widgetModel
      .find({
        duration: { $gte: minDuration, $lte: maxDuration },
      })
      .populate('keyframes')
      .exec();
  }
}
