import { Module } from '@nestjs/common';
import { AverageDataProxyController } from './proxy.controller';
import { AverageDataProxyService } from './proxy.service';

@Module({
  controllers: [AverageDataProxyController],
  providers: [AverageDataProxyService],
  exports: [AverageDataProxyService]
})
export class AverageDataProxyModule {}