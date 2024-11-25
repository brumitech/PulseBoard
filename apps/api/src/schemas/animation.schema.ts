import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AnimationDocument = Animation & Document;

@Schema({ timestamps: true })
export class Animation {
  @Prop({ required: true })
  duration: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Widget' }] })
  widgets: string[];

  @Prop({ type: String, default: 'lerp' })
  interpolationFunction: string;
}

export const AnimationSchema = SchemaFactory.createForClass(Animation);
