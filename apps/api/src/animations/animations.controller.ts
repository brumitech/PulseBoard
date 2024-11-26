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
import { AnimationsService } from './animations.service';
import { CreateAnimationDto } from './dto/create-animation.dto';
import { UpdateAnimationDto } from './dto/update-animation.dto';

@ApiTags('animations')
@Controller('animations')
export class AnimationsController {
  constructor(private readonly animationsService: AnimationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new animation' })
  @ApiResponse({ status: 201, description: 'Animation created successfully' })
  async create(@Body() createAnimationDto: CreateAnimationDto) {
    return this.animationsService.create(createAnimationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all animations' })
  async findAll() {
    return this.animationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an animation by id' })
  @ApiResponse({ status: 200, description: 'Animation found' })
  @ApiResponse({ status: 404, description: 'Animation not found' })
  async findOne(@Param('id') id: string) {
    const animation = await this.animationsService.findOne(id);
    if (!animation) {
      throw new NotFoundException('Animation not found');
    }
    return animation;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an animation' })
  @ApiResponse({ status: 200, description: 'Animation updated successfully' })
  @ApiResponse({ status: 404, description: 'Animation not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAnimationDto: UpdateAnimationDto
  ) {
    const animation = await this.animationsService.update(
      id,
      updateAnimationDto
    );
    if (!animation) {
      throw new NotFoundException('Animation not found');
    }
    return animation;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an animation' })
  @ApiResponse({ status: 200, description: 'Animation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Animation not found' })
  async remove(@Param('id') id: string) {
    const animation = await this.animationsService.remove(id);
    if (!animation) {
      throw new NotFoundException('Animation not found');
    }
    return animation;
  }
}
