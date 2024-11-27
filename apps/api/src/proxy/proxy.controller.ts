import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AverageDataProxyService } from './proxy.service';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('Average Data Proxy')
@Controller('proxy')
export class AverageDataProxyController {
  constructor(
    private readonly averageDataProxyService: AverageDataProxyService
  ) {}

  @ApiOperation({ 
    summary: 'Fetch average sensor data', 
    description: 'Retrieves average sensor data based on specified parameters' 
  })
  @ApiQuery({ 
    name: 'averageType', 
    required: false, 
    enum: ['day', 'week', 'month'], 
    description: 'Type of average calculation' 
  })
  @ApiQuery({ 
    name: 'valueType', 
    required: false, 
    description: 'Type of sensor value (e.g., pm10, temperature)' 
  })
  @ApiQuery({ 
    name: 'sensorId', 
    required: false, 
    description: 'ID of the sensor' 
  })
  @ApiQuery({ 
    name: 'fromDate', 
    required: false, 
    description: 'Start date for data retrieval' 
  })
  @ApiQuery({ 
    name: 'toDate', 
    required: false, 
    description: 'End date for data retrieval' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful data retrieval',
    schema: {
      type: 'object',
      properties: {
        average: { type: 'number', example: 25.5 },
        count: { type: 'number', example: 10 }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Failed to fetch average data' },
        details: { type: 'string' }
      }
    }
  })
  @Get('/')
async getAverageData(
 @Res() res: Response,
 @Query('averageType') averageType: 'day' | 'week' | 'month' = 'week',
 @Query('valueType') valueType: string = 'pm10',
 @Query('sensorId') sensorId: string = '-1',
 @Query('fromDate') fromDate?: string,
 @Query('toDate') toDate?: string,
) {
 // Explicitly disable caching for this endpoint
 res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
 res.set('Pragma', 'no-cache');
 res.set('Expires', '0');

 try {
   console.log('Received Parameters:', {
     averageType,
     valueType,
     sensorId,
     fromDate,
     toDate
   });

   const result = await this.averageDataProxyService.fetchAverageData(
     averageType,
     valueType,
     sensorId,
     fromDate ? new Date(fromDate) : undefined,
     toDate ? new Date(toDate) : undefined
   );

   console.log('Fetched Result:', result);

   // Explicitly set content type and send response
   res.header('Content-Type', 'application/json');
   res.status(200).json(result || { message: 'No data found' });
 } catch (error) {
   console.error('Full Error:', error);
   res.status(500).json({
     error: 'Failed to fetch average data',
     details: error.message,
     stack: error.stack
   });
 }
}
}

