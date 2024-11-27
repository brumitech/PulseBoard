

// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class AverageDataProxyService {
//   private readonly BASE_URL = 'https://skopje.pulse.eco/rest/avgData';

//   async fetchAverageData(
//     averageType: 'day' | 'week' | 'month',
//     valueType: string,
//     sensorId: string = '-1',
//     fromDate?: Date,
//     toDate?: Date
//   ): Promise<{ average: number; count: number } | null> {
//     // If no dates provided, use current date range
//     // const now = toDate || new Date();
//     const now = new Date('2024-11-01T00:00:00')
//     // const from = fromDate || new Date(now.getTime() - this.getTimePeriod(averageType));
//     const from = new Date('2024-10-01T00:00:00')

//     const formatDate = (date: Date) => {
//       return date.toISOString().replace('Z', '%2b01:00');
//     };

//     try {
//       const response = await axios.get(
//         `${this.BASE_URL}/${averageType}`, 
//         {
//           params: {
//             sensorId,
//             type: valueType,
//             from: formatDate(from),
//             to: formatDate(now)
//           },
//           headers: {
//             'Accept': 'application/json'
//           }
//         }
//       );

//       const data = response.data;

//       if (data.length === 0) return null;

//       const totalValue = data.reduce((sum, item) => sum + parseFloat(item.value), 0);
//       const average = totalValue / data.length;

//       return {
//         average: Number(average.toFixed(2)),
//         count: data.length
//       };

//     } catch (error) {
//       console.error('Failed to fetch average data:', error);
//       return null;
//     }
//   }

//   private getTimePeriod(averageType: 'day' | 'week' | 'month'): number {
//     switch (averageType) {
//       case 'day': return 24 * 60 * 60 * 1000;
//       case 'week': return 7 * 24 * 60 * 60 * 1000;
//       case 'month': return 30 * 24 * 60 * 60 * 1000;
//     }
//   }
// }


import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AverageDataProxyService {
  private readonly BASE_URL = 'https://skopje.pulse.eco/rest/avgData';

  async fetchAverageData(
    averageType: 'day' | 'week' | 'month',
    valueType: string,
    sensorId: string = '-1',
    fromDate?: Date,
    toDate?: Date
  ): Promise<{ average: number; count: number } | null> {
    // If no dates provided, use current date range
    const now = toDate || new Date();
    const from = fromDate || new Date(now.getTime() - this.getTimePeriod(averageType));

    const formatDate = (date: Date) => {
      return date.toISOString().replace('Z', '+01:00');
    };

    try {
      const response = await axios.get(
        `${this.BASE_URL}/${averageType}`, 
        {
          params: {
            sensorId,
            type: valueType,
            from: formatDate(from),
            to: formatDate(now)
          },
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const data = response.data;
      if (data.length === 0) return null;

      const totalValue = data.reduce((sum, item) => sum + parseFloat(item.value), 0);
      const average = totalValue / data.length;

      return {
        average: Number(average.toFixed(2)),
        count: data.length
      };
    } catch (error) {
      console.error('Failed to fetch average data:', error);
      return null;
    }
  }

  private getTimePeriod(averageType: 'day' | 'week' | 'month'): number {
    switch (averageType) {
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
    }
  }
}