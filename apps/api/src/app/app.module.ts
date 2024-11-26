import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ScreensModule } from '../screens/screens.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimationsModule } from '../animations/animations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
    }),
    DatabaseModule,
    ScreensModule,
    AnimationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
