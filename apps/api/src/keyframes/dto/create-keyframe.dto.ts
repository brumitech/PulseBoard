import { IsNumber, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKeyframeDto {
  @IsNumber()
  timestamp: number;

  @IsObject()
  @Type(() => Object)
  props: Record<string, any>;

  @IsString()
  widgetId: string;
}
