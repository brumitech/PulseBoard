import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type KeyframeDocument = Keyframe & Document;

@Schema({ timestamps: true })
export class Keyframe {
  @Prop({ required: true })
  timestamp: number;

  @Prop({ type: Object, required: true })
  props: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Widget', required: true })
  widgetId: string;
}

export const KeyframeSchema = SchemaFactory.createForClass(Keyframe);
