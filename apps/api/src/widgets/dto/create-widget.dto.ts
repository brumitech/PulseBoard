import {
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWidgetDto {
  @IsString()
  componentType: string;

  @IsNumber()
  start: number;

  @IsNumber()
  duration: number;

  @IsArray()
  @IsOptional()
  keyframes?: string[];

  @IsObject()
  @Type(() => Object)
  initialProps: Record<string, any>;

  @IsObject()
  @IsOptional()
  @Type(() => Object)
  containerStyle?: Record<string, any>;
}
