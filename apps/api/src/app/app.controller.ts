// apps/api/src/app/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Screen, ScreenDocument } from '../schemas/screen.schema';

@Controller()
export class AppController {
  constructor(
    @InjectModel(Screen.name) private screenModel: Model<ScreenDocument>
  ) {}

  @Get('test')
  async test() {
    try {
      const testScreen = new this.screenModel({
        latitude: 40.7128,
        longitude: -74.006,
        animationId: '507f1f77bcf86cd799439011', // dummy ObjectId
      });

      await testScreen.save();

      const screens = await this.screenModel.find().exec();
      return { message: 'Test successful', screens };
    } catch (error) {
      console.error('Test endpoint error:', error);
      return { error: error.message };
    }
  }
}
