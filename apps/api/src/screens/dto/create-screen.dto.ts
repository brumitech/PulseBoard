import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateScreenDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  animationId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
