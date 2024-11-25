import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { ScreensModule } from '../screens/screens.module';
import { AnimationsModule } from '../animations/animations.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { KeyframesModule } from '../keyframes/keyframes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
    }),
    DatabaseModule,
    ScreensModule,
    AnimationsModule,
    WidgetsModule,
    KeyframesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
