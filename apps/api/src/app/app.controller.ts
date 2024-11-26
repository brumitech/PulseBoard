import { Controller, Post, Get, Logger } from '@nestjs/common';
import { AnimationsService } from '../animations/animations.service';
import { ScreensService } from '../screens/screens.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly screensService: ScreensService,
    private readonly animationsService: AnimationsService
  ) {}

  @Post('seed')
  async seedData() {
    this.logger.log('Starting seed operation...');

    try {
      // Create animation
      const animation1 = await this.animationsService.create({
        name: 'Air Quality Display 1',
        duration: 10000,
        widgets: [
          {
            id: 'widget_1',
            type: 'TextWidget',
            keyframes: [
              {
                timestamp: 0,
                props: {
                  x: 100,
                  y: 100,
                  scale: 0.5,
                  color: '255,254,253',
                },
              },
            ],
          },
        ],
      });

      this.logger.log('Animation created:', animation1);

      // Create screen
      const screen1 = await this.screensService.create({
        latitude: 41.9981,
        longitude: 21.4254,
        animationId: animation1.id,
      });

      this.logger.log('Screen created:', screen1);

      return {
        message: 'Database seeded successfully',
        data: {
          animation: animation1,
          screen: screen1,
        },
      };
    } catch (error) {
      this.logger.error('Error during seed:', error);
      throw error;
    }
  }

  @Get('test-data')
  async getTestData() {
    try {
      const animations = await this.animationsService.findAll();
      const screens = await this.screensService.findAll();

      this.logger.log(
        `Found ${animations.length} animations and ${screens.length} screens`
      );

      return {
        animations,
        screens,
      };
    } catch (error) {
      this.logger.error('Error fetching test data:', error);
      throw error;
    }
  }
}
