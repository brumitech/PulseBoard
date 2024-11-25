import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWidgetDto: CreateWidgetDto) {
    return this.widgetsService.create(createWidgetDto);
  }

  @Get()
  findAll() {
    return this.widgetsService.findAll();
  }

  @Get('type/:componentType')
  findByComponentType(@Param('componentType') componentType: string) {
    return this.widgetsService.findByComponentType(componentType);
  }

  @Get('duration')
  findByDuration(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number
  ) {
    const minDuration = min ?? 0;
    const maxDuration = max ?? Number.MAX_SAFE_INTEGER;
    return this.widgetsService.findByDuration(minDuration, maxDuration);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.widgetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWidgetDto: UpdateWidgetDto) {
    return this.widgetsService.update(id, updateWidgetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.widgetsService.remove(id);
  }
}
