import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'screens' })
export class Screen extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ type: String, ref: 'animations' })
  animationId?: string;

  @Prop({ required: true, default: 'inactive' })
  status: 'active' | 'inactive';

  @Prop()
  lastPing?: Date;
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);
