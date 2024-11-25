import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateAnimationDto {
  @IsNumber()
  duration: number;

  @IsArray()
  @IsOptional()
  widgets?: string[];

  @IsString()
  @IsOptional()
  interpolationFunction?: string = 'lerp';
}
