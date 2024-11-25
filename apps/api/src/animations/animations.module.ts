import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Animation, AnimationSchema } from '../schemas/animation.schema';
import { AnimationsService } from './animations.service';
import { AnimationsController } from './animations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Animation.name, schema: AnimationSchema },
    ]),
  ],
  controllers: [AnimationsController],
  providers: [AnimationsService],
  exports: [AnimationsService],
})
export class AnimationsModule {}
