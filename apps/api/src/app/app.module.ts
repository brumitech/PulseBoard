// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AverageDataProxyModule } from '../proxy/proxy.module';
// import { AverageDataProxyModule } from '../proxy/proxy.module';

@Module({
  imports: [AverageDataProxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}