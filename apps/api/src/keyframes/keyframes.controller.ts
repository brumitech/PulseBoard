import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { KeyframesService } from './keyframes.service';
import { CreateKeyframeDto } from './dto/create-keyframe.dto';
import { UpdateKeyframeDto } from './dto/update-keyframe.dto';

@Controller('keyframes')
export class KeyframesController {
  constructor(private readonly keyframesService: KeyframesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createKeyframeDto: CreateKeyframeDto) {
    return this.keyframesService.create(createKeyframeDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() createKeyframeDtos: CreateKeyframeDto[]) {
    return this.keyframesService.createMany(createKeyframeDtos);
  }

  @Get()
  findAll() {
    return this.keyframesService.findAll();
  }

  @Get('widget/:widgetId')
  findByWidgetId(@Param('widgetId') widgetId: string) {
    return this.keyframesService.findByWidgetId(widgetId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keyframesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKeyframeDto: UpdateKeyframeDto
  ) {
    return this.keyframesService.update(id, updateKeyframeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.keyframesService.remove(id);
  }

  @Delete('widget/:widgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByWidgetId(@Param('widgetId') widgetId: string) {
    return this.keyframesService.removeByWidgetId(widgetId);
  }
}
