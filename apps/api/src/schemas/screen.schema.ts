import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ScreenDocument = Screen & Document;

@Schema({ timestamps: true })
export class Screen {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Animation',
    required: true,
  })
  animationId: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);
