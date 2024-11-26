import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class KeyframeProps {
  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  y: number;

  @ApiProperty()
  @IsNumber()
  scale: number;

  @ApiProperty()
  @IsString()
  color: string;
}

class Keyframe {
  @ApiProperty()
  @IsNumber()
  timestamp: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => KeyframeProps)
  props: KeyframeProps;
}

class Widget {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ type: [Keyframe] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Keyframe)
  keyframes: Keyframe[];
}

export class CreateAnimationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty({ type: [Widget] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Widget)
  widgets: Widget[];
}
