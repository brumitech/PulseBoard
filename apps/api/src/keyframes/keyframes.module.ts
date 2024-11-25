import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyframesService } from './keyframes.service';
import { KeyframesController } from './keyframes.controller';
import { Keyframe, KeyframeSchema } from '../schemas/keyframe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Keyframe.name, schema: KeyframeSchema },
    ]),
  ],
  controllers: [KeyframesController],
  providers: [KeyframesService],
  exports: [KeyframesService],
})
export class KeyframesModule {}
