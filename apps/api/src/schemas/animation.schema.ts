import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class KeyframeProps {
  x: number;
  y: number;
  scale: number;
  color: string;
}

class Keyframe {
  timestamp: number;
  props: KeyframeProps;
}

class Widget {
  id: string;
  type: string;
  keyframes: Keyframe[];
}

@Schema({ collection: 'animations' })
export class Animation extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: Array, required: true })
  widgets: Widget[];
}

export const AnimationSchema = SchemaFactory.createForClass(Animation);
