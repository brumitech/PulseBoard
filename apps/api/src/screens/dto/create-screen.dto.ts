import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScreenDto {
  @ApiProperty({ description: 'Latitude of the screen location' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude of the screen location' })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ description: 'Associated animation ID' })
  @IsOptional()
  @IsString()
  animationId?: string;
}
