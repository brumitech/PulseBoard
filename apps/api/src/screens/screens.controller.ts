import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScreensService } from './screens.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@ApiTags('screens')
@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new screen' })
  @ApiResponse({ status: 201, description: 'Screen created successfully' })
  async create(@Body() createScreenDto: CreateScreenDto) {
    return this.screensService.create(createScreenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all screens' })
  async findAll() {
    return this.screensService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a screen by id' })
  @ApiResponse({ status: 200, description: 'Screen found' })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async findOne(@Param('id') id: string) {
    const screen = await this.screensService.findOne(id);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a screen' })
  @ApiResponse({ status: 200, description: 'Screen updated successfully' })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async update(
    @Param('id') id: string,
    @Body() updateScreenDto: UpdateScreenDto
  ) {
    const screen = await this.screensService.update(id, updateScreenDto);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a screen' })
  @ApiResponse({ status: 200, description: 'Screen deleted successfully' })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async remove(@Param('id') id: string) {
    const screen = await this.screensService.remove(id);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }
}
