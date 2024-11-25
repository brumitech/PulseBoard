import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WidgetDocument = Widget & Document;

@Schema({ timestamps: true })
export class Widget {
  @Prop({ required: true })
  componentType: string;

  @Prop({ required: true })
  start: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Keyframe' }] })
  keyframes: string[];

  @Prop({ type: Object, required: true })
  initialProps: Record<string, any>;

  @Prop({ type: Object })
  containerStyle?: Record<string, any>;
}

export const WidgetSchema = SchemaFactory.createForClass(Widget);
