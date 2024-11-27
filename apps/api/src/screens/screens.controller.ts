import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
  Patch,
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

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle screen status (active/inactive)' })
  @ApiResponse({ status: 200, description: 'Status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async toggleStatus(@Param('id') id: string) {
    return this.screensService.toggleStatus(id);
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

  @Get('bounds')
  @ApiOperation({ summary: 'Get screens within map bounds' })
  async findWithinBounds(
    @Query('latMin') latMin: number,
    @Query('latMax') latMax: number,
    @Query('lngMin') lngMin: number,
    @Query('lngMax') lngMax: number
  ) {
    return this.screensService.findWithinBounds({
      latMin,
      latMax,
      lngMin,
      lngMax,
    });
  }

  @Patch(':id/assign-animation')
  @ApiOperation({ summary: 'Assign an animation to a screen' })
  @ApiResponse({ status: 200, description: 'Animation assigned successfully' })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async assignAnimation(
    @Param('id') id: string,
    @Body('animationId') animationId: string
  ) {
    const screen = await this.screensService.assignAnimation(id, animationId);
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
